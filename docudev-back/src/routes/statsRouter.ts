import { Router } from 'express'
import { StatsController } from '../controllers/StatsController'
import { authenticate } from '../middleware/auth'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

router.get('/', authenticate, StatsController.getUserStats)

export default router
