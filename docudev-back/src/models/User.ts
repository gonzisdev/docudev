import mongoose, { Document, Schema, Model } from 'mongoose'
import { hashPassword, checkPassword } from '../utils/auth'

export interface IUser extends Document {
  name: string
  surname: string
  email: string
  password: string
  token: string
  image: string
  role: 'admin' | 'user'
  phone: string
  status: 'active' | 'inactive' | 'suspended'
  code: string
  lastActivity: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true
    },
    surname: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    token: {
      type: String
    },
    image: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    phone: {
      type: String
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'inactive'
    },
    code: {
      type: String,
      default: '',
      expires: '1h'
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    this.password = await hashPassword(this.password as string)
    next()
  } catch (error) {
    next(error instanceof Error ? error : new Error(String(error)))
  }
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await checkPassword(candidatePassword, this.password as string)
}

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)

export default User
