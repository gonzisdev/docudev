import { Request, Response } from 'express'
import Team from '../models/Team'
import Docu from '../models/Docu'

export class DocuController {
  static async createDocu(req: Request, res: Response) {
    try {
      const { title, content, team } = req.body
      //TODO: Logic to check if the user can crete a docu (limitations, etc.)
      if (req.user.status !== 'active') {
        res.status(403).json({ error: 'Invalid credentials' })
        return
      }
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
      const limit = parseInt(req.query.limit as string) || 10
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

      let query: any = { ...baseQuery }

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
      const docus = await Docu.find(query)
        .populate('owner', 'name surname')
        .select('-content')
        .sort(sort)
        .collation(collationOptions)
        .skip(skip)
        .limit(limit)
        .exec()
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
      const docu = await Docu.findById(req.params.docuId).populate(
        'owner',
        'name surname'
      )
      if (!docu) {
        res.status(404).json({ error: 'Docu not found' })
        return
      }
      if (req.user.status !== 'active') {
        res.status(403).json({ error: 'Invalid credentials' })
        return
      }
      if (docu.team) {
        const teamFound = await Team.findById(docu.team)
        if (!teamFound) {
          res.status(404).json({ error: 'Team not found' })
          return
        }
        const isTeamOwner =
          req.user._id.toString() === teamFound.owner.toString()
        const isTeamCollaborator = teamFound.collaborators.some(
          (collaborator) =>
            collaborator._id.toString() === req.user._id.toString()
        )
        if (!isTeamOwner && !isTeamCollaborator) {
          res.status(403).json({ error: 'Invalid credentials' })
          return
        }
      } else {
        if (docu.owner._id.toString() !== req.user._id.toString()) {
          res.status(403).json({ error: 'Invalid credentials' })
          return
        }
      }
      res.status(200).json(docu)
    } catch (error) {
      console.error('Error getting docu:', error)
      res.status(500).json({ error: 'Error getting docu' })
    }
  }

  static async updateDocu(req: Request, res: Response) {
    try {
      const { docuId } = req.params
      const { title, content, team } = req.body
      const docu = await Docu.findById(docuId)
      if (!docu) {
        res.status(404).json({ error: 'Docu not found' })
        return
      }
      if (req.user.status !== 'active') {
        res.status(403).json({ error: 'Invalid credentials' })
        return
      }
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
      } else {
        if (docu.owner.toString() !== req.user._id.toString()) {
          res.status(403).json({ error: 'Invalid credentials' })
          return
        }
      }
      if (docu.team && docu.team.toString() !== team) {
        await Team.findByIdAndUpdate(docu.team, {
          $pull: { docus: docuId }
        })
      }
      if (team && (!docu.team || docu.team.toString() !== team)) {
        await Team.findByIdAndUpdate(team, {
          $push: { docus: docuId }
        })
      }
      docu.title = title
      docu.content = content
      docu.team = team ? team : null
      await docu.save()
      res.status(200).json(true)
    } catch (error) {
      console.error('Error updating docu:', error)
      res.status(500).json({ error: 'Error updating docu' })
    }
  }

  static async deleteDocu(req: Request, res: Response) {
    try {
      const { docuId } = req.params
      const docu = await Docu.findById(docuId)
      if (req.user.status !== 'active') {
        res.status(403).json({ error: 'Invalid credentials' })
        return
      }
      if (!docu) {
        res.status(404).json({ error: 'Docu not found' })
        return
      }
      if (docu.team) {
        const teamFound = await Team.findById(docu.team)
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
        await Team.findByIdAndUpdate(docu.team, {
          $pull: { docus: docuId }
        })
      } else {
        if (docu.owner.toString() !== req.user._id.toString()) {
          res.status(403).json({ error: 'Invalid credentials' })
          return
        }
      }
      await Docu.findByIdAndDelete(docuId)
      res.status(200).json(true)
    } catch (error) {
      console.error('Error deleting docu:', error)
      res.status(500).json({ error: 'Error deleting docu' })
    }
  }
}
