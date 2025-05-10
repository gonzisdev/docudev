import mongoose, { Document, Schema, Model } from 'mongoose'

export interface ITeam extends Document {
  name: string
  description: string
  owner: mongoose.Types.ObjectId
  collaborators: mongoose.Types.ObjectId[]
  docs: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const TeamSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    color: {
      type: String,
      required: true
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    docus: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Docu'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Team: Model<ITeam> = mongoose.model<ITeam>('Team', TeamSchema)

export default Team
