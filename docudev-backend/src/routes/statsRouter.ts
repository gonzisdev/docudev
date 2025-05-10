import { Router } from 'express'
import { StatsController } from '../controllers/StatsController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, StatsController.getUserStats)

export default router
