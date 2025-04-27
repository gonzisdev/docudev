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
  body('name')
    .notEmpty()
    .withMessage('Team name is required')
    .isString()
    .withMessage('Team name must be text')
    .isLength({ min: 2 })
    .withMessage('Team name must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Team name cannot exceed 50 characters')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Team description is required')
    .isString()
    .withMessage('Team description must be text')
    .isLength({ min: 5 })
    .withMessage('Team description must be at least 5 characters long')
    .isLength({ max: 120 })
    .withMessage('Team description cannot exceed 120 characters')
    .trim(),
  authenticate,
  handleInputErrors,
  TeamController.createTeam
)

router.get('/', authenticate, TeamController.getTeams)

router.get('/:teamId', authenticate, TeamController.getTeam)

router.patch(
  '/:teamId',
  body('name')
    .notEmpty()
    .withMessage('Team name is required')
    .isString()
    .withMessage('Team name must be text')
    .isLength({ min: 2 })
    .withMessage('Team name must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Team name cannot exceed 50 characters')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Team description is required')
    .isString()
    .withMessage('Team description must be text')
    .isLength({ min: 5 })
    .withMessage('Team description must be at least 5 characters long')
    .isLength({ max: 120 })
    .withMessage('Team description cannot exceed 120 characters')
    .trim(),
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
