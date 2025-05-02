import { Request, Response } from 'express'
import Notification from '../models/Notification'
import Team from '../models/Team'
import User from '../models/User'

export class NotificationController {
  static async sendInvite(req: Request, res: Response) {
    const { email, teamId } = req.body
    const receiver = await User.findOne({
      email
    })
    if (!receiver) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    const team = await Team.findById(teamId)
    if (!team || team.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'Only the team owner can invite users' })
      return
    }
    if (
      team.owner.toString() === receiver._id.toString() ||
      team.collaborators.some(
        (collaborator) =>
          collaborator._id.toString() === receiver._id.toString()
      )
    ) {
      res.status(400).json({ error: 'User is already in the team' })
      return
    }
    const existingInvite = await Notification.findOne({
      type: 'team-invite',
      receiver: receiver._id,
      team: teamId,
      status: 'pending'
    })
    if (existingInvite) {
      res
        .status(400)
        .json({ error: 'There is already a pending invitation for this user' })
      return
    }
    await Notification.create({
      type: 'team-invite',
      sender: req.user._id,
      receiver: receiver._id,
      team: teamId,
      status: 'pending'
    })
    res.status(201).json(true)
  }

  static async getNotifications(req: Request, res: Response) {
    const notifications = await Notification.find({ receiver: req.user._id })
      .populate('sender', 'name surname')
      .populate('team', 'name')
      .sort({ createdAt: -1 })
    res.status(200).json(notifications)
  }

  static async respondInvite(req: Request, res: Response) {
    const { notificationId } = req.params
    const { response } = req.body // 'accepted' | 'rejected'
    const notification = await Notification.findById(notificationId)
    if (
      !notification ||
      notification.receiver.toString() !== req.user._id.toString()
    ) {
      res.status(404).json({ error: 'Notification not found' })
      return
    }
    notification.status = response
    await notification.save()

    if (response === 'accepted') {
      await Team.findByIdAndUpdate(notification.team, {
        $addToSet: { collaborators: req.user._id }
      })
      await Notification.create({
        type: 'invite-accepted',
        sender: req.user._id,
        receiver: notification.sender,
        team: notification.team,
        status: 'pending'
      })
    }
    res.status(200).json(true)
  }

  static async markAsRead(req: Request, res: Response) {
    const { notificationId } = req.params
    const notification = await Notification.findById(notificationId)
    if (
      !notification ||
      notification.receiver.toString() !== req.user._id.toString()
    ) {
      res.status(404).json({ error: 'Notification not found' })
      return
    }
    notification.status = 'read'
    await notification.save()
    res.status(200).json(true)
  }

  static async deleteNotification(req: Request, res: Response) {
    const { notificationId } = req.params
    const notification = await Notification.findById(notificationId)
    if (
      !notification ||
      notification.receiver.toString() !== req.user._id.toString()
    ) {
      res.status(404).json({ error: 'Notification not found' })
      return
    }
    await Notification.findByIdAndDelete(notificationId)
    res.status(200).json(true)
  }
}
