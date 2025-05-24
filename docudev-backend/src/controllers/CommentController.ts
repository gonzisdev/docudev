import { Request, Response } from 'express'
import { IUser } from '../models/User'
import Comment from '../models/Comment'
import Notification from '../models/Notification'
import mongoose from 'mongoose'

export class CommentController {
  static async getComments(req: Request, res: Response) {
    try {
      const { docuId } = req.params
      const comments = await Comment.find({ docu: docuId })
        .populate('author', 'name surname image')
        .populate('mentions', 'name surname image')
        .sort({ createdAt: -1 })
      res.status(200).json(comments)
    } catch (error) {
      console.error('Error getting comments:', error)
      res.status(500).json({ error: 'Error getting comments' })
    }
  }

  static async createComment(req: Request, res: Response) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const { docuId } = req.params
      const { content, mentions } = req.body

      const newComment = await Comment.create(
        [
          {
            content,
            docu: docuId,
            author: req.user._id,
            mentions: mentions || []
          }
        ],
        { session }
      )

      if (mentions && mentions.length > 0) {
        const mentionNotifications = mentions
          .filter((userId: IUser['_id']) => userId !== req.user._id.toString())
          .map((userId: IUser['_id']) => ({
            type: 'mention',
            sender: req.user._id,
            receiver: userId,
            docu: docuId,
            comment: newComment[0]._id,
            status: 'pending'
          }))

        if (mentionNotifications.length > 0) {
          await Notification.insertMany(mentionNotifications, { session })
        }
      }

      await session.commitTransaction()
      session.endSession()

      const populatedComment = await Comment.findById(newComment[0]._id)
        .populate('author', 'name surname image')
        .populate('mentions', 'name surname image')

      res.status(201).json(populatedComment)
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      console.error('Error creating comment:', error)
      res.status(500).json({ error: 'Error creating comment' })
    }
  }

  static async deleteComment(req: Request, res: Response) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const { commentId } = req.params
      const comment = await Comment.findById(commentId).session(session)
      if (!comment) {
        await session.abortTransaction()
        session.endSession()
        res.status(404).json({ error: 'Comment not found' })
        return
      }
      if (comment.author.toString() !== req.user._id.toString()) {
        await session.abortTransaction()
        session.endSession()
        res.status(403).json({ error: 'Unauthorized' })
        return
      }
      await Notification.deleteMany({ comment: commentId }, { session })
      await Comment.findByIdAndDelete(commentId, { session })
      await session.commitTransaction()
      session.endSession()
      res.status(200).json({ success: true })
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      console.error('Error deleting comment:', error)
      res.status(500).json({ error: 'Error deleting comment' })
    }
  }
}
