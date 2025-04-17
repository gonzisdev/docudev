import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'
import { authenticate } from '../middleware/auth'
import { TeamController } from '../controllers/TeamController'

const router = Router()

router.use(limiter)

router.post(
  '/create-team',
  body('name').notEmpty().withMessage('Team name is required'),
  body('description').notEmpty().withMessage('Team description is required'),
  authenticate,
  handleInputErrors,
  TeamController.createTeam
)

router.get('/', authenticate, TeamController.getTeams)

router.get('/:teamId', authenticate, TeamController.getTeam)

router.patch(
  '/:teamId',
  body('name').notEmpty().withMessage('Team name is required'),
  body('description').notEmpty().withMessage('Team description is required'),
  authenticate,
  handleInputErrors,
  TeamController.updateTeam
)

router.delete(
  '/:teamId',
  authenticate,
  handleInputErrors,
  TeamController.deleteTeam
)

export default router
