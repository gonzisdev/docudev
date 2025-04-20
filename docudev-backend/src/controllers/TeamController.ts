import { Request, Response } from 'express'
import Team from '../models/Team'
import Docu from '../models/Docu'

export class TeamController {
  static async createTeam(req: Request, res: Response) {
    try {
      const { name, description } = req.body
      if (req.user.role !== 'admin' || req.user.status !== 'active') {
        res.status(403).json({ error: 'Invalid credentials' })
        return
      }
      await Team.create({
        name,
        description,
        owner: req.user._id
      })
      res.status(201).json(true)
    } catch (error) {
      console.error('Error creating team:', error)
      res.status(500).json({ error: 'Error creating team' })
    }
  }

  static async getTeams(req: Request, res: Response) {
    try {
      const ownedTeams = await Team.find({ owner: req.user._id }).populate({
        path: 'collaborators',
        select: '-password -code -token'
      })
      const collaborativeTeams = await Team.find({
        collaborators: req.user._id
      }).populate({
        path: 'collaborators',
        select: '-password -code -token'
      })
      const allTeams = [...ownedTeams, ...collaborativeTeams]
      res.status(200).json(allTeams)
    } catch (error) {
      console.error('Error getting teams:', error)
      res.status(500).json({ error: 'Error getting teams' })
    }
  }

  static async getTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params
      const team = await Team.findById(teamId).populate({
        path: 'collaborators',
        select: '-password -code -token'
      })
      if (!team) {
        res.status(404).json({ error: 'Team not found' })
        return
      }
      if (
        team.owner.toString() !== req.user._id.toString() &&
        !team.collaborators.some(
          (collaborator) =>
            collaborator._id.toString() === req.user._id.toString()
        )
      ) {
        res.status(403).json({ error: 'Invalid credentials' })
        return
      }
      res.status(200).json(team)
    } catch (error) {
      console.error('Error getting team:', error)
      res.status(500).json({ error: 'Error getting team' })
    }
  }

  static async updateTeam(req: Request, res: Response) {
    try {
      const { name, description } = req.body
      const { teamId } = req.params
      const team = await Team.findById(teamId)
      if (!team) {
        res.status(404).json({ error: 'Team not found' })
        return
      }
      if (
        !(
          team.owner.toString() === req.user._id.toString() &&
          req.user.role === 'admin' &&
          req.user.status === 'active'
        )
      ) {
        res.status(403).json({ error: 'Invalid credentials' })
        return
      }
      await Team.findByIdAndUpdate(teamId, {
        name,
        description
      })
      res.status(200).json(true)
    } catch (error) {
      console.error('Error updating team:', error)
      res.status(500).json({ error: 'Error updating team' })
    }
  }

  static async deleteTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params
      const team = await Team.findById(teamId)
      if (!team) {
        res.status(404).json({ error: 'Team not found' })
        return
      }
      if (
        !(
          team.owner.toString() === req.user._id.toString() &&
          req.user.role === 'admin' &&
          req.user.status === 'active'
        )
      ) {
        res.status(403).json({ error: 'Invalid credentials' })
        return
      }

      await Team.findByIdAndDelete(teamId)
      await Docu.deleteMany({ team: teamId })
      res.status(200).json(true)
    } catch (error) {
      console.error('Error deleting team:', error)
      res.status(500).json({ error: 'Error deleting team' })
    }
  }
}
