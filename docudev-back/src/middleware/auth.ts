import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
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
  const accessToken = req.cookies?.accessToken

  if (!accessToken) {
    res.status(401).json({ error: 'Missing token', invalidToken: true })
    return
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    ) as JwtPayload

    const user = (await User.findById(decoded.id).select(
      '-password -code -refreshTokens'
    )) as IUser

    if (!user) {
      res.status(401).json({ error: 'Invalid token', invalidToken: true })
      return
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Token expired',
        invalidToken: true,
        shouldRefresh: true
      })
      return
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token', invalidToken: true })
      return
    }

    res.status(500).json({ error: 'Server error during authentication' })
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
