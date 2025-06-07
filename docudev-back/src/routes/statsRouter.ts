import { Router } from 'express'
import { StatsController } from '../controllers/StatsController'
import { authenticate } from '../middleware/auth'
import { updateUserActivity } from '../middleware/lastActivity'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

router.get('/', authenticate, updateUserActivity, StatsController.getUserStats)

export default router
