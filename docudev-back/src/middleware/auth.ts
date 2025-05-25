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
    const error = new Error('Missing authorization header')
    res.status(401).json({ error: error.message, invalidToken: true })
    return
  }
  const [, token] = bearer.split(' ')
  if (!token) {
    const error = new Error('Missing token')
    res.status(401).json({ error: error.message, invalidToken: true })
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (typeof decoded === 'object' && decoded.id) {
      const user = (await User.findById(decoded.id).select(
        '-password -code'
      )) as IUser
      if (!user.token || user.token !== token) {
        res.status(401).json({ error: 'Invalid token', invalidToken: true })
        return
      }
      req.user = user
      next()
    }
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      res
        .status(401)
        .json({ error: 'Expired or invalid session', invalidToken: true })
    } else {
      res.status(500).json({ error: 'There was a server error' })
    }
  }
}

export const validateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = req.user
  if (!user && req.body?.email) {
    user = await User.findOne({ email: req.body.email })
  }
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }
  if (user.status === 'suspended') {
    res.status(401).json({ error: 'Your account is suspended' })
    return
  }
  req.user = user
  next()
}
