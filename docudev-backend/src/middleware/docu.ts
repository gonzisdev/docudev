import { Request, Response, NextFunction } from 'express'
import Docu, { IDocu } from '../models/Docu'
import Team from '../models/Team'

declare global {
  namespace Express {
    interface Request {
      docu?: IDocu
    }
  }
}

export const canAccessDocu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const docuId = req.params.docuId || req.body.docuId
  if (!docuId) {
    res.status(400).json({ error: 'Docu ID is required' })
    return
  }
  const docu = await Docu.findById(docuId)
  if (!docu) {
    res.status(404).json({ error: 'Docu not found' })
    return
  }
  if (docu.team) {
    const team = await Team.findById(docu.team)
    if (
      !team ||
      (req.user._id.toString() !== team.owner.toString() &&
        !team.collaborators.some(
          (collaborator) =>
            collaborator._id.toString() === req.user._id.toString()
        ))
    ) {
      res.status(403).json({ error: 'No permission for this docu' })
      return
    }
  } else {
    if (docu.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'No permission for this docu' })
      return
    }
  }
  req.docu = docu
  next()
}
