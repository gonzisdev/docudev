import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization
  if (!bearer) {
    const error = new Error('Unauthorized')
    res.status(401).json({ error: error.message })
    return
  }
  const [, token] = bearer.split(' ')
  if (!token) {
    const error = new Error('Invalid token')
    res.status(401).json({ error: error.message })
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (typeof decoded === 'object' && decoded.id) {
      req.user = (await User.findById(decoded.id)
        .select('-password -code')
        .lean()) as IUser
      next()
    }
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      res
        .status(401)
        .json({ error: 'Expired or invalid session', tokenExpired: true })
    } else {
      res.status(500).json({ error: 'There was a server error' })
    }
  }
}
