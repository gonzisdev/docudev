import { Request, Response } from 'express'
import Team, { ITeam } from '../models/Team'
import Docu, { IDocu } from '../models/Docu'
import Comment from '../models/Comment'
import Notification from '../models/Notification'
import mongoose, { FilterQuery } from 'mongoose'
import fs from 'fs'
import path from 'path'

export class DocuController {
  static async createDocu(req: Request, res: Response) {
    try {
      const { title, content, team } = req.body
      if (team) {
        const teamFound = (await Team.findById(team).populate(
          'owner',
          'role'
        )) as unknown as (ITeam & { owner: { role: string } }) | null
        if (!teamFound) {
          res.status(404).json({ error: 'Team not found' })
          return
        }
        if (
          req.user._id.toString() !== teamFound.owner._id.toString() &&
          !teamFound.collaborators.some(
            (collaborator) =>
              collaborator._id.toString() === req.user._id.toString()
          )
        ) {
          res.status(403).json({ error: 'Invalid team access' })
          return
        }
        if (teamFound.owner.role !== 'admin') {
          res.status(403).json({
            error:
              'Team owner does not have an admin plan. Cannot create documents in this team'
          })
          return
        }
        const teamDocusCount = await Docu.countDocuments({ team: team })
        if (teamDocusCount >= 100) {
          res
            .status(400)
            .json({ error: 'Team document limit reached (100 documents)' })
          return
        }
      } else {
        const userDocusWithoutTeamCount = await Docu.countDocuments({
          owner: req.user._id,
          team: null
        })
        if (userDocusWithoutTeamCount >= 100) {
          res
            .status(400)
            .json({ error: 'Personal document limit reached (100 documents)' })
          return
        }
      }

      const newDocu = await Docu.create({
        title,
        content,
        owner: req.user._id,
        team: team ? team : null
      })
      if (team) {
        await Team.findByIdAndUpdate(team, {
          $push: { docus: newDocu._id }
        })
      }
      res.status(201).json(true)
    } catch (error) {
      console.error('Error creating docu:', error)
      res.status(500).json({ error: 'Error creating docu' })
    }
  }

  static async getDocus(req: Request, res: Response) {
    try {
      if (req.user.status !== 'active') {
        res.status(403).json({ error: 'Invalid credentials' })
        return
      }
      const page = parseInt(req.query.page as string) || 1
      let limit = parseInt(req.query.limit as string)
      if (isNaN(limit)) limit = 10
      const search = req.query.search as string
      const teamId = req.query.teamId as string
      const ownerId = req.query.ownerId as string
      const sortField = (req.query.sortField as string) || 'updatedAt'
      const sortDirection = (req.query.sortDirection as string) || 'desc'

      const userTeams = await Team.find({
        $or: [{ owner: req.user._id }, { collaborators: req.user._id }]
      }).select('_id')
      const teamIds = userTeams.map((team) => team._id)

      const baseQuery = {
        $or: [{ owner: req.user._id }, { team: { $in: teamIds } }]
      }

      let query: FilterQuery<IDocu> = { ...baseQuery }

      if (search) {
        query.title = { $regex: search, $options: 'i' }
      }

      if (teamId) {
        const teamExists = teamIds.some((id) => id.toString() === teamId)
        if (!teamExists) {
          res.status(403).json({ error: 'Invalid team access' })
          return
        }
        query.team = teamId
      }

      if (ownerId) {
        query.owner = ownerId
      }

      const skip = (page - 1) * limit

      const sort: { [key: string]: 'asc' | 'desc' } = {}
      if (['title', 'createdAt', 'updatedAt'].includes(sortField)) {
        sort[sortField] = sortDirection === 'asc' ? 'asc' : 'desc'
      } else {
        sort.updatedAt = 'desc'
      }
      const collationOptions =
        sortField === 'title' ? { locale: 'es', strength: 2 } : undefined
      let queryBuilder = Docu.find(query)
        .populate('owner', 'name surname image')
        .populate('team', 'name color')
        .select('-content')
        .sort(sort)
        .collation(collationOptions)
        .skip(skip)

      if (limit > 0) {
        queryBuilder = queryBuilder.limit(limit)
      }

      const docus = await queryBuilder.exec()
      const total = await Docu.countDocuments(query)

      res.status(200).json({
        data: docus,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      console.error('Error getting docus:', error)
      res.status(500).json({ error: 'Error getting docus' })
    }
  }

  static async getDocuCounts(req: Request, res: Response) {
    try {
      const { teamId } = req.query
      if (teamId) {
        const teamDocusCount = await Docu.countDocuments({ team: teamId })
        res.status(200).json({
          amount: teamDocusCount
        })
      } else {
        const userDocusWithoutTeamCount = await Docu.countDocuments({
          owner: req.user._id,
          team: null
        })
        res.status(200).json({
          amount: userDocusWithoutTeamCount
        })
      }
    } catch (error) {
      console.error('Error getting docu counts:', error)
      res.status(500).json({ error: 'Error getting docu counts' })
    }
  }

  static async getDocu(req: Request, res: Response) {
    try {
      await Docu.updateOne(
        { _id: req.docu._id },
        { $inc: { views: 1 } },
        { timestamps: false }
      )
      const docu = await Docu.findById(req.docu._id)
        .populate('owner', 'name surname image')
        .populate({
          path: 'team',
          select: 'name color owner collaborators',
          populate: [
            { path: 'owner', select: 'name surname image role' },
            { path: 'collaborators', select: 'name surname image' }
          ]
        })
      res.status(200).json(docu)
    } catch (error) {
      console.error('Error getting docu:', error)
      res.status(500).json({ error: 'Error getting docu' })
    }
  }

  static async updateDocu(req: Request, res: Response) {
    try {
      const { title, content, team } = req.body
      const currentTeam = req.docu.team?.toString()
      const newTeam = team || null
      const isChangingTeam = currentTeam !== newTeam
      if (
        isChangingTeam &&
        req.docu.owner.toString() !== req.user._id.toString()
      ) {
        res.status(403).json({
          error: 'Only the document owner can change the team assignment'
        })
        return
      }
      if (isChangingTeam && newTeam) {
        const teamFound = (await Team.findById(newTeam).populate(
          'owner',
          'role'
        )) as unknown as (ITeam & { owner: { role: string } }) | null
        if (!teamFound) {
          res.status(404).json({ error: 'Team not found' })
          return
        }

        if (
          req.user._id.toString() !== teamFound.owner._id.toString() &&
          !teamFound.collaborators.some(
            (collaborator) =>
              collaborator._id.toString() === req.user._id.toString()
          )
        ) {
          res.status(403).json({ error: 'Invalid team access' })
          return
        }
        if (teamFound.owner.role !== 'admin') {
          res.status(403).json({
            error:
              'Team owner does not have an admin plan. Cannot assign documents to this team'
          })
          return
        }
        const teamDocusCount = await Docu.countDocuments({ team: newTeam })
        if (teamDocusCount >= 100) {
          res.status(400).json({
            error: 'Team document limit reached (100 documents)'
          })
          return
        }
      }
      if (isChangingTeam && !newTeam) {
        const userDocusWithoutTeamCount = await Docu.countDocuments({
          owner: req.user._id,
          team: null
        })
        if (userDocusWithoutTeamCount >= 100) {
          res.status(400).json({
            error: 'Personal document limit reached (100 documents)'
          })
          return
        }
      }
      if (req.docu.team) {
        const currentTeamData = (await Team.findById(req.docu.team).populate(
          'owner',
          'role'
        )) as unknown as (ITeam & { owner: { role: string } }) | null
        if (currentTeamData && currentTeamData.owner.role !== 'admin') {
          res.status(403).json({
            error:
              'Team owner does not have an admin plan. Cannot edit documents in this team'
          })
          return
        }
      }
      if (currentTeam && isChangingTeam) {
        await Team.findByIdAndUpdate(currentTeam, {
          $pull: { docus: req.docu._id }
        })
      }
      if (newTeam && isChangingTeam) {
        await Team.findByIdAndUpdate(newTeam, {
          $push: { docus: req.docu._id }
        })
      }
      req.docu.title = title
      req.docu.content = content
      req.docu.team = newTeam
      await req.docu.save()

      res.status(200).json(true)
    } catch (error) {
      console.error('Error updating docu:', error)
      res.status(500).json({ error: 'Error updating docu' })
    }
  }

  static async removeFromTeam(req: Request, res: Response) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const teamId = req.docu.team
      await Team.findByIdAndUpdate(
        teamId,
        { $pull: { docus: req.docu._id } },
        { session }
      )
      await Docu.findByIdAndUpdate(
        req.docu._id,
        { $unset: { team: 1 } },
        { session }
      )

      await session.commitTransaction()
      session.endSession()
      res.status(200).json(true)
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      console.error('Error removing document from team:', error)
      res.status(500).json({ error: 'Error removing document from team' })
    }
  }

  static async deleteDocu(req: Request, res: Response) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      if (req.docu.owner.toString() !== req.user._id.toString()) {
        await session.abortTransaction()
        session.endSession()
        res
          .status(403)
          .json({ error: 'Only the document owner can delete this document' })
        return
      }
      const docuId = req.docu._id
      if (Array.isArray(req.docu.images)) {
        for (const filename of req.docu.images) {
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
      await Notification.deleteMany({ docu: docuId }, { session })
      const comments = await Comment.find({ docu: docuId })
        .select('_id')
        .session(session)
      const commentIds = comments.map((comment) => comment._id)
      if (commentIds.length > 0) {
        await Notification.deleteMany(
          { comment: { $in: commentIds } },
          { session }
        )
      }
      await Comment.deleteMany({ docu: docuId }, { session })
      if (req.docu.team) {
        await Team.findByIdAndUpdate(
          req.docu.team,
          { $pull: { docus: req.docu._id } },
          { session }
        )
      }
      await Docu.findByIdAndDelete(req.docu._id, { session })
      await session.commitTransaction()
      session.endSession()
      res.status(200).json(true)
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      console.error('Error deleting docu:', error)
      res.status(500).json({ error: 'Error deleting docu' })
    }
  }

  static async uploadDocuImage(req: Request, res: Response) {
    try {
      const image = (req as any).file
      if (!image) {
        res.status(400).json({ error: 'No file uploaded' })
        return
      }
      const docu = await Docu.findById(req.params.docuId)
      if (!docu) {
        res.status(404).json({ error: 'Docu not found' })
        return
      }

      const filename = image.filename
      if (!docu.images) docu.images = []
      docu.images.push(filename)
      await docu.save()

      res.status(201).json({ url: `/uploads/${filename}`, filename })
    } catch (err) {
      res.status(500).json({ error: 'Error uploading image' })
    }
  }

  static async getDocuImages(req: Request, res: Response) {
    try {
      const docu = await Docu.findById(req.params.docuId)
      if (!docu) {
        res.status(404).json({ error: 'Docu not found' })
        return
      }
      const images = (docu.images || []).map((filename) => ({
        url: `/uploads/${filename}`,
        filename
      }))
      res.json(images)
    } catch (err) {
      res.status(500).json({ error: 'Error fetching images' })
    }
  }

  static async deleteDocuImage(req: Request, res: Response) {
    try {
      const { docuId, filename } = req.params
      const docu = await Docu.findById(docuId)
      if (!docu) {
        res.status(404).json({ error: 'Docu not found' })
        return
      }

      docu.images = (docu.images || []).filter((img) => img !== filename)
      await docu.save()

      const filePath = path.join(path.resolve(), 'uploads', filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      res.status(200).json(true)
    } catch (err) {
      res.status(500).json({ error: 'Error deleting image' })
    }
  }
}
