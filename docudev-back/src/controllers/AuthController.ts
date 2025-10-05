import { Request, Response } from 'express'
import User from '../models/User'
import Docu from '../models/Docu'
import Team from '../models/Team'
import Comment from '../models/Comment'
import Notification from '../models/Notification'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import { sendEmail } from '../utils/email'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'

export class AuthController {
  static async createAccount(req: Request, res: Response) {
    try {
      const { name, surname, email, password } = req.body
      const userExists = await User.findOne({ email })
      if (userExists) {
        res.status(400).json({ error: 'The user is already registered' })
        return
      }
      await User.create({
        name,
        surname,
        email,
        password
      })
      res.status(201).json(true)
    } catch (error) {
      console.error('Error creating account:', error)
      res.status(500).json({ error: 'Error creating account' })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { password } = req.body
      const isMatch = await req.user.comparePassword(password)
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }
      const accessToken = generateAccessToken(req.user._id.toString())
      const refreshToken = generateRefreshToken(req.user._id.toString())
      const userAgent = req.headers['user-agent'] || 'unknown'
      const ip = req.ip || req.socket?.remoteAddress || 'unknown'

      req.user.refreshTokens = req.user.refreshTokens || []

      if (req.user.refreshTokens.length >= +process.env.MAX_REFRESH_TOKENS!) {
        req.user.refreshTokens.shift()
      }

      req.user.refreshTokens.push({
        token: refreshToken,
        userAgent,
        ip,
        createdAt: new Date()
      })

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 1000 * 60 * 15 // 15 min
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
      })
      await User.findByIdAndUpdate(req.user._id, {
        lastActivity: new Date(),
        refreshTokens: req.user.refreshTokens
      })
      const userResponse = await User.findById(req.user._id)
        .select('-password -code -refreshTokens')
        .lean()
      res.status(200).json(userResponse)
    } catch (error) {
      console.error('Error during login:', error)
      res.status(500).json({ error: 'Error during login' })
    }
  }

  static async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken
    const userAgent = req.headers['user-agent'] || 'unknown'
    const ip = req.ip || req.socket?.remoteAddress || 'unknown'

    if (!refreshToken) {
      res
        .status(401)
        .json({ error: 'Missing refresh token', invalidToken: true })
      return
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as JwtPayload
      const user = await User.findById(decoded.id)
      if (!user) {
        res
          .status(401)
          .json({ error: 'Invalid refresh token', invalidToken: true })
        return
      }

      const tokenEntry = (user.refreshTokens || []).find(
        (t: any) => t.token === refreshToken
      )
      if (!tokenEntry) {
        user.refreshTokens = []
        await user.save()
        res.status(401).json({
          error: 'Refresh token reuse detected. All sessions invalidated.',
          invalidToken: true
        })
        return
      }
      if (tokenEntry.userAgent !== userAgent || tokenEntry.ip !== ip) {
        res.status(401).json({
          error: 'Refresh token used from different device',
          invalidToken: true
        })
        return
      }
      if (user.status !== 'active') {
        res
          .status(401)
          .json({ error: 'Account not active', invalidToken: true })
        return
      }

      user.refreshTokens = user.refreshTokens.filter(
        (t: any) => t.token !== refreshToken
      )
      const newRefreshToken = generateRefreshToken(user._id.toString())
      user.refreshTokens.push({
        token: newRefreshToken,
        userAgent,
        ip,
        createdAt: new Date()
      })
      const newAccessToken = generateAccessToken(user._id.toString())
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 1000 * 60 * 15 // 15 min
      })
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
      })
      await User.findByIdAndUpdate(user._id, {
        lastActivity: new Date(),
        refreshTokens: user.refreshTokens
      })
      res.status(200).json(true)
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        res.status(401).json({
          error: 'Invalid or expired refresh token',
          invalidToken: true
        })
        return
      }
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken
      if (refreshToken && req.user) {
        req.user.refreshTokens = req.user.refreshTokens.filter(
          (t) => t !== refreshToken
        )
        await req.user.save()
      }
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
      })
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
      })
      res.status(200).json(true)
    } catch (error) {
      console.error('Error during logout:', error)
      res.status(500).json({ error: 'Error during logout' })
    }
  }

  static async recoverPassword(req: Request, res: Response) {
    try {
      req.user.code = Math.floor(100000 + Math.random() * 900000).toString()
      await req.user.save()
      await sendEmail(req.user.email, req.user.code)
      res.status(200).json(true)
    } catch (error) {
      console.error('Error sending email to recover password:', error)
      res.status(500).json({ error: 'Error sending email to recover password' })
    }
  }

  static async newPassword(req: Request, res: Response) {
    try {
      const { password, code } = req.body
      if (req.user.code !== code) {
        res.status(401).json({ error: 'Invalid code' })
        return
      }
      req.user.password = password
      req.user.code = ''
      req.user.save()
      res.status(200).json(true)
    } catch (error) {
      console.error('Error changing password:', error)
      res.status(500).json({ error: 'Error changing password' })
    }
  }

  static async updateAccount(req: Request, res: Response) {
    try {
      const { name, surname, phone } = req.body
      const image = (req as any).file
      req.user.name = name
      req.user.surname = surname
      req.user.phone = phone
      if (image) {
        req.user.image = image.filename
      }
      await req.user.save()
      res.status(200).json(true)
    } catch (error) {
      console.error('Error updating account:', error)
      res.status(500).json({ error: 'Error updating account' })
    }
  }

  static async deleteAccount(req: Request, res: Response) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const userId = req.user._id
      const ownedTeams = await Team.find({ owner: userId })
        .select('_id')
        .session(session)
      const ownedTeamIds = ownedTeams.map((team) => team._id)
      const userDocus = await Docu.find({ owner: userId })
        .select('_id')
        .session(session)
      for (const docu of userDocus) {
        if (Array.isArray(docu.images)) {
          for (const filename of docu.images) {
            const filePath = path.join(path.resolve(), 'uploads', filename)
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath)
              } catch (err) {
                console.error(`Error deleting file ${filename}:`, err)
              }
            }
          }
        }
      }
      const userDocuIds = userDocus.map((docu) => docu._id)
      if (userDocuIds.length > 0) {
        const comments = await Comment.find({ docu: { $in: userDocuIds } })
          .select('_id')
          .session(session)
        const commentIds = comments.map((comment) => comment._id)
        await Notification.deleteMany(
          { docu: { $in: userDocuIds } },
          { session }
        )
        if (commentIds.length > 0) {
          await Notification.deleteMany(
            { comment: { $in: commentIds } },
            { session }
          )
        }
        await Comment.deleteMany({ docu: { $in: userDocuIds } }, { session })
        await Docu.deleteMany({ owner: userId }, { session })
      }
      if (ownedTeamIds.length > 0) {
        const otherUserDocsInOwnedTeams = await Docu.find({
          team: { $in: ownedTeamIds },
          owner: { $ne: userId }
        }).session(session)
        if (otherUserDocsInOwnedTeams.length > 0) {
          const otherDocIds = otherUserDocsInOwnedTeams.map((docu) => docu._id)
          const commentsOfOtherDocs = await Comment.find({
            docu: { $in: otherDocIds }
          })
            .select('_id')
            .session(session)
          const commentIdsOfOtherDocs = commentsOfOtherDocs.map(
            (comment) => comment._id
          )
          await Notification.deleteMany(
            { docu: { $in: otherDocIds } },
            { session }
          )
          if (commentIdsOfOtherDocs.length > 0) {
            await Notification.deleteMany(
              { comment: { $in: commentIdsOfOtherDocs } },
              { session }
            )
          }
          await Comment.deleteMany({ docu: { $in: otherDocIds } }, { session })
          await Docu.updateMany(
            { team: { $in: ownedTeamIds }, owner: { $ne: userId } },
            { $unset: { team: 1 } },
            { session }
          )
        }
      }
      await Comment.deleteMany({ author: userId }, { session })
      await Team.deleteMany({ owner: userId }, { session })
      await Team.updateMany(
        { collaborators: userId },
        { $pull: { collaborators: userId } },
        { session }
      )
      await Docu.updateMany(
        { collaborators: userId },
        { $pull: { collaborators: userId } },
        { session }
      )
      await Notification.deleteMany(
        {
          $or: [{ sender: userId }, { receiver: userId }]
        },
        { session }
      )
      await User.findByIdAndDelete(userId, { session })
      await session.commitTransaction()
      session.endSession()
      res.status(200).json(true)
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      console.error('Error deleting account:', error)
      res.status(500).json({ error: 'Error deleting account' })
    }
  }

  static async updatePlan(req: Request, res: Response) {
    try {
      if (req.user.role === 'admin') {
        req.user.role = 'user'
      } else if (req.user.role === 'user') {
        req.user.role = 'admin'
      }
      await req.user.save()
      res.status(200).json(true)
    } catch (error) {
      console.error('Error updating role:', error)
      res.status(500).json({ error: 'Error updating role' })
    }
  }

  static async user(req: Request, res: Response) {
    res.status(200).json(req.user)
  }
}
