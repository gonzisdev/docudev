import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IDocu extends Document {
  title: string
  content: string
  owner: mongoose.Types.ObjectId
  team: mongoose.Types.ObjectId
  views: number
  createdAt: Date
  updatedAt: Date
}

const DocuSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Docu: Model<IDocu> = mongoose.model<IDocu>('Docu', DocuSchema)

export default Docu
