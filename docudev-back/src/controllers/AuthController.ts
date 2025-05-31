import { Request, Response } from 'express'
import User from '../models/User'
import Docu from '../models/Docu'
import Team from '../models/Team'
import Comment from '../models/Comment'
import Notification from '../models/Notification'
import jwt from 'jsonwebtoken'
import { generateJWT } from '../utils/jwt'
import { sendEmail } from '../utils/email'
import mongoose from 'mongoose'

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
      if (req.user.token) {
        try {
          jwt.verify(req.user.token, process.env.JWT_SECRET)
        } catch (err) {
          const token = generateJWT(req.user._id.toString())
          req.user.token = token
        }
      } else {
        const token = generateJWT(req.user._id.toString())
        req.user.token = token
      }
      req.user.status = 'active'
      await req.user.save()
      const userResponse = await User.findById(req.user._id)
        .select('-password -code ')
        .lean()
      res.status(200).json(userResponse)
    } catch (error) {
      console.error('Error during login:', error)
      res.status(500).json({ error: 'Error during login' })
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
