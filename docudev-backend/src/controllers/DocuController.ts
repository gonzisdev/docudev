import { Request, Response } from 'express'
import Team from '../models/Team'
import Docu, { IDocu } from '../models/Docu'
import { FilterQuery } from 'mongoose'

export class DocuController {
  static async createDocu(req: Request, res: Response) {
    try {
      const { title, content, team } = req.body
      if (team) {
        const teamFound = await Team.findById(team)
        if (
          !teamFound ||
          (req.user._id.toString() !== teamFound.owner.toString() &&
            !teamFound.collaborators.some(
              (collaborator) =>
                collaborator._id.toString() === req.user._id.toString()
            ))
        ) {
          res.status(403).json({ error: 'Invalid credentials' })
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
            { path: 'owner', select: 'name surname image' },
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
      if (req.docu.team && req.docu.team.toString() !== team) {
        await Team.findByIdAndUpdate(req.docu.team, {
          $pull: { docus: req.docu._id }
        })
      }
      if (team && (!req.docu.team || req.docu.team.toString() !== team)) {
        await Team.findByIdAndUpdate(team, {
          $push: { docus: req.docu._id }
        })
      }
      req.docu.title = title
      req.docu.content = content
      req.docu.team = team ? team : null
      await req.docu.save()
      res.status(200).json(true)
    } catch (error) {
      console.error('Error updating docu:', error)
      res.status(500).json({ error: 'Error updating docu' })
    }
  }

  static async deleteDocu(req: Request, res: Response) {
    try {
      if (req.docu.team) {
        await Team.findByIdAndUpdate(req.docu.team, {
          $pull: { docus: req.docu._id }
        })
      }
      await Docu.findByIdAndDelete(req.docu._id)
      res.status(200).json(true)
    } catch (error) {
      console.error('Error deleting docu:', error)
      res.status(500).json({ error: 'Error deleting docu' })
    }
  }
}
