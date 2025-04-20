import { Request, Response } from 'express'
import Team from '../models/Team'
import User from '../models/User'
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
      const userTeams = await Team.find({
        $or: [{ owner: req.user._id }, { collaborators: req.user._id }]
      }).select('_id')
      const teamIds = userTeams.map((team) => team._id)
      const docus = await Docu.find({
        $or: [{ owner: req.user._id }, { team: { $in: teamIds } }]
      }).populate('owner', 'name surname')
      res.status(200).json(docus)
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
