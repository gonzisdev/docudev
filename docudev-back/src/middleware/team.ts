import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Team, { ITeam } from '../models/Team'

declare global {
  namespace Express {
    interface Request {
      team?: ITeam
    }
  }
}

export const canAccessTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { teamId } = req.params
  if (!teamId) {
    res.status(400).json({ error: 'Team ID is required' })
    return
  }
  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    res.status(400).json({ error: 'Invalid Team ID format' })
    return
  }
  const team = await Team.findById(teamId)
  if (!team) {
    res.status(404).json({ error: 'Team not found' })
    return
  }
  if (
    team.owner.toString() !== req.user._id.toString() &&
    !team.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    res.status(403).json({ error: 'No permission for this team' })
    return
  }
  req.team = team
  next()
}

export const isTeamOwnerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { teamId } = req.params
  const team = await Team.findById(teamId)
  if (!team) {
    res.status(404).json({ error: 'Team not found' })
    return
  }
  if (
    team.owner.toString() !== req.user._id.toString() ||
    req.user.role !== 'admin' ||
    req.user.status !== 'active'
  ) {
    res.status(403).json({ error: 'No permission for this team' })
    return
  }
  req.team = team
  next()
}
