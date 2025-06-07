import { Request, Response, NextFunction } from 'express'
import User from '../models/User'

export const updateUserActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user && req.user._id) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      await User.findOneAndUpdate(
        {
          _id: req.user._id,
          $or: [
            { lastActivity: { $lt: fiveMinutesAgo } },
            { lastActivity: { $exists: false } }
          ]
        },
        {
          lastActivity: new Date()
        }
      )
    }
    next()
  } catch (error) {
    next()
  }
}
