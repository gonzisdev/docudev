import { Request, Response } from 'express'
import Team from '../models/Team'
import Docu from '../models/Docu'
import User from '../models/User'
import mongoose from 'mongoose'

export class StatsController {
  static async getUserStats(req: Request, res: Response) {
    try {
      const userTeams = await Team.find({
        $or: [{ owner: req.user._id }, { collaborators: req.user._id }]
      }).select('_id')
      const teamIds = userTeams.map((team) => team._id)

      const teamsWithMostMembers = await Team.aggregate([
        {
          $match: {
            _id: { $in: teamIds }
          }
        },
        {
          $project: {
            name: 1,
            color: 1,
            memberCount: {
              $add: [1, { $size: { $ifNull: ['$collaborators', []] } }]
            }
          }
        },
        {
          $sort: { memberCount: -1 }
        },
        {
          $limit: 5
        }
      ])

      const teamsWithMostDocus = await Team.aggregate([
        {
          $match: {
            _id: { $in: teamIds }
          }
        },
        {
          $project: {
            name: 1,
            color: 1,
            docuCount: { $size: { $ifNull: ['$docus', []] } }
          }
        },
        {
          $sort: { docuCount: -1 }
        },
        {
          $limit: 5
        }
      ])

      const lastUpdatedDocus = await Docu.find({
        $or: [{ owner: req.user._id }, { team: { $in: teamIds } }]
      })
        .select('title updatedAt team')
        .populate('team', 'name color')
        .sort({ updatedAt: -1 })
        .limit(5)

      const lastCreatedDocus = await Docu.find({
        $or: [{ owner: req.user._id }, { team: { $in: teamIds } }]
      })
        .select('title createdAt team')
        .populate('team', 'name color')
        .sort({ createdAt: -1 })
        .limit(5)

      const mostActiveUsers = await Docu.aggregate([
        {
          $match: {
            $or: [{ owner: req.user._id }, { team: { $in: teamIds } }]
          }
        },
        {
          $group: {
            _id: '$owner',
            docuCount: { $sum: 1 }
          }
        },
        {
          $sort: { docuCount: -1 }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $project: {
            _id: 1,
            docuCount: 1,
            name: { $arrayElemAt: ['$userInfo.name', 0] },
            surname: { $arrayElemAt: ['$userInfo.surname', 0] }
          }
        }
      ])

      const totalTeams = teamIds.length
      const totalDocus = await Docu.countDocuments({
        $or: [{ owner: req.user._id }, { team: { $in: teamIds } }]
      })
      const ownedDocus = await Docu.countDocuments({ owner: req.user._id })
      const teamDocus = await Docu.countDocuments({ team: { $in: teamIds } })

      res.status(200).json({
        teamsWithMostMembers,
        teamsWithMostDocus,
        lastUpdatedDocus,
        lastCreatedDocus,
        mostActiveUsers,
        generalStats: {
          totalTeams,
          totalDocus,
          ownedDocus,
          teamDocus
        }
      })
    } catch (error) {
      console.error('Error getting user stats:', error)
      res.status(500).json({ error: 'Error getting user stats' })
    }
  }
}
