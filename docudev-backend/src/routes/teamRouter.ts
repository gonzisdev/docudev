import { Router } from 'express'
import { body } from 'express-validator'
import { TeamController } from '../controllers/TeamController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { canAccessTeam, isTeamOwnerAdmin } from '../middleware/team'
import { limiter } from '../config/limiter'

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

router.get('/:teamId', authenticate, canAccessTeam, TeamController.getTeam)

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
  isTeamOwnerAdmin,
  TeamController.updateTeam
)

router.delete(
  '/:teamId',
  authenticate,
  handleInputErrors,
  isTeamOwnerAdmin,
  TeamController.deleteTeam
)

export default router
