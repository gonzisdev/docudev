import mongoose, { Document, Schema, Model } from 'mongoose'

export interface INotification extends Document {
  type: 'team-invite' | 'invite-accepted' | 'invite-rejected' | 'mention'
  sender: mongoose.Types.ObjectId
  receiver: mongoose.Types.ObjectId
  team?: mongoose.Types.ObjectId
  docu?: mongoose.Types.ObjectId
  comment?: mongoose.Types.ObjectId
  status: 'pending' | 'accepted' | 'rejected' | 'read'
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['team-invite', 'invite-accepted', 'invite-rejected', 'mention'],
      required: true
    },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    docu: { type: Schema.Types.ObjectId, ref: 'Docu' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'read'],
      default: 'pending'
    }
  },
  { timestamps: true, versionKey: false }
)

const Notification: Model<INotification> = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
)

export default Notification
