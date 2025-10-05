import jwt from 'jsonwebtoken'
import { IUser } from '../models/User'

export function generateAccessToken(userId: IUser['_id']) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
}

export function generateRefreshToken(userId: IUser['_id']) {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined')
  }
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  })
}
