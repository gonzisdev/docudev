import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { authenticate } from '../middleware/auth'
import Docu from '../models/Docu'
import User from '../models/User'
import { limiter } from '../config/limiter'
import Team from '../models/Team'

const router = Router()

router.use(limiter)

router.get('/:folder/:filename', authenticate, async (req, res) => {
  const { folder, filename } = req.params

  if (folder === 'avatars') {
    const user = await User.findOne({ image: filename })
    if (user) {
      const filePath = path.join(path.resolve(), 'uploads', 'avatars', filename)
      if (!fs.existsSync(filePath)) {
        res.status(404).send('Not found')
        return
      }
      res.sendFile(filePath)
      return
    }
    res.status(404).send('Not found')
    return
  }

  if (folder === 'docu-images') {
    const docu = await Docu.findOne({ images: filename })
    if (!docu) {
      res.status(404).send('Not found')
      return
    }

    const userId = req.user._id.toString()
    const isOwner = docu.owner.toString() === userId

    let isTeamOwner = false
    let isTeamCollaborator = false

    if (docu.team) {
      const team = await Team.findById(docu.team)
      if (team) {
        isTeamOwner = team.owner.toString() === userId
        isTeamCollaborator = team.collaborators.some(
          (id: any) => id.toString() === userId
        )
      }
    }

    if (!isOwner && !isTeamOwner && !isTeamCollaborator) {
      res.status(403).send('Forbidden')
      return
    }

    const filePath = path.join(
      path.resolve(),
      'uploads',
      'docu-images',
      filename
    )
    if (!fs.existsSync(filePath)) {
      res.status(404).send('Not found')
      return
    }
    res.sendFile(filePath)
    return
  }

  res.status(404).send('Not found')
})

export default router
