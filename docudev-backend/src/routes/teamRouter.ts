import { Router } from 'express'
import { body } from 'express-validator'
import { TeamController } from '../controllers/TeamController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate, validateUserStatus } from '../middleware/auth'
import { canAccessTeam, isTeamOwnerAdmin } from '../middleware/team'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

router.post(
  '/create-team',
  authenticate,
  validateUserStatus,
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
  body('color')
    .notEmpty()
    .withMessage('Team color is required')
    .isString()
    .withMessage('Team color must be text')
    .isLength({ min: 7 })
    .withMessage('Team color must be a valid hex color code')
    .isLength({ max: 7 })
    .withMessage('Team color must be a valid hex color code')
    .trim(),
  handleInputErrors,
  TeamController.createTeam
)

router.get('/', authenticate, TeamController.getTeams)

router.get(
  '/:teamId',
  authenticate,
  validateUserStatus,
  canAccessTeam,
  TeamController.getTeam
)

router.patch(
  '/update-team/:teamId',
  authenticate,
  validateUserStatus,
  isTeamOwnerAdmin,
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
  handleInputErrors,
  TeamController.updateTeam
)

router.patch(
  '/leave/:teamId',
  authenticate,
  validateUserStatus,
  canAccessTeam,
  TeamController.leaveTeam
)

router.patch(
  '/remove-collaborator/:teamId',
  authenticate,
  validateUserStatus,
  isTeamOwnerAdmin,
  body('collaboratorId')
    .notEmpty()
    .withMessage('Collaborator ID is required')
    .isString()
    .withMessage('Collaborator ID must be text')
    .trim(),
  handleInputErrors,
  TeamController.removeCollaborator
)

router.patch(
  '/remove-collaborators/:teamId',
  authenticate,
  validateUserStatus,
  isTeamOwnerAdmin,
  body('collaborators')
    .notEmpty()
    .withMessage('Collaborators array is required')
    .isArray()
    .withMessage('Collaborators must be an array'),
  handleInputErrors,
  TeamController.removeMultipleCollaborators
)

router.delete(
  '/delete-team/:teamId',
  authenticate,
  validateUserStatus,
  isTeamOwnerAdmin,
  TeamController.deleteTeam
)

export default router
