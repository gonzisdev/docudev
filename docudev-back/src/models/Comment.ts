import mongoose, { Document, Schema } from 'mongoose'

export interface IComment extends Document {
  content: string
  docu: mongoose.Types.ObjectId
  author: mongoose.Types.ObjectId
  mentions: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    docu: {
      type: Schema.Types.ObjectId,
      ref: 'Docu',
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model<IComment>('Comment', CommentSchema)
