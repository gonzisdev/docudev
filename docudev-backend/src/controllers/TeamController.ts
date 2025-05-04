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
      const ownedTeamsCount = await Team.countDocuments({ owner: req.user._id })
      if (ownedTeamsCount >= 10) {
        res.status(403).json({ error: 'Maximum number of teams (10) reached' })
        return
      }
      const team = await Team.create({
        name,
        description,
        owner: req.user._id
      })
      res.status(201).json(team)
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
      const teamId = req.team?._id
      if (!teamId) {
        res.status(404).json({ error: 'Team not found' })
        return
      }
      const team = await Team.findById(teamId)
        .populate({ path: 'owner', select: '-password -code -token' })
        .populate({ path: 'collaborators', select: '-password -code -token' })

      if (!team) {
        res.status(404).json({ error: 'Team not found' })
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
      await Team.findByIdAndUpdate(req.team._id, {
        name,
        description
      })
      res.status(200).json(true)
    } catch (error) {
      console.error('Error updating team:', error)
      res.status(500).json({ error: 'Error updating team' })
    }
  }

  static async leaveTeam(req: Request, res: Response) {
    try {
      if (req.team.owner.toString() === req.user._id.toString()) {
        res.status(403).json({ error: 'Owner cannot leave the team' })
        return
      }
      await Team.findByIdAndUpdate(req.team._id, {
        $pull: { collaborators: req.user._id }
      })
      await Docu.updateMany(
        { team: req.team._id },
        { $pull: { collaborators: req.user._id } }
      )
      res.status(200).json(true)
    } catch (error) {
      console.error('Error leaving team:', error)
      res.status(500).json({ error: 'Error leaving team' })
    }
  }

  static async removeCollaborator(req: Request, res: Response) {
    try {
      const { collaboratorId } = req.body
      if (req.team.owner.toString() !== req.user._id.toString()) {
        res
          .status(403)
          .json({ error: 'Only the owner can remove collaborators' })
        return
      }
      await Team.findByIdAndUpdate(req.team._id, {
        $pull: { collaborators: collaboratorId }
      })
      await Docu.updateMany(
        { team: req.team._id },
        { $pull: { collaborators: collaboratorId } }
      )
      res.status(200).json(true)
    } catch (error) {
      console.error('Error removing collaborator:', error)
      res.status(500).json({ error: 'Error removing collaborator' })
    }
  }

  static async removeMultipleCollaborators(req: Request, res: Response) {
    try {
      const { collaborators } = req.body
      if (req.team.owner.toString() !== req.user._id.toString()) {
        res
          .status(403)
          .json({ error: 'Only the owner can remove collaborators' })
        return
      }
      await Team.findByIdAndUpdate(req.team._id, {
        $pull: { collaborators: { $in: collaborators } }
      })
      await Docu.updateMany(
        { team: req.team._id },
        { $pull: { collaborators: { $in: collaborators } } }
      )
      res.status(200).json(true)
    } catch (error) {
      console.error('Error removing multiple collaborators:', error)
      res.status(500).json({ error: 'Error removing multiple collaborators' })
    }
  }

  static async deleteTeam(req: Request, res: Response) {
    try {
      const team = req.team
      if (!team) {
        res.status(404).json({ error: 'Team not found' })
        return
      }
      await Team.findByIdAndDelete(team._id)
      await Docu.deleteMany({ team: team._id })
      res.status(200).json(true)
    } catch (error) {
      console.error('Error deleting team:', error)
      res.status(500).json({ error: 'Error deleting team' })
    }
  }
}
