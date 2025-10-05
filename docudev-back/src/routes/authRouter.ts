import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate, validateUserStatus } from '../middleware/auth'
import { updateUserActivity } from '../middleware/lastActivity'
import {
  uploadAvatarImage,
  deletePreviousImage,
  deleteImage
} from '../middleware/multer'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

router.post(
  '/create-account',
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be text')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters')
    .trim(),
  body('surname')
    .notEmpty()
    .withMessage('Surname is required')
    .isString()
    .withMessage('Surname must be text')
    .isLength({ min: 2 })
    .withMessage('Surname must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Surname must not exceed 50 characters')
    .trim(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Email not valid')
    .normalizeEmail()
    .trim(),
  handleInputErrors,
  AuthController.createAccount
)

router.post(
  '/login',
  validateUserStatus,
  body('password').notEmpty().withMessage('Password is required').trim(),
  body('email').isEmail().withMessage('Email not valid').trim(),
  handleInputErrors,
  AuthController.login
)

router.post('/refresh-token', AuthController.refreshToken)

router.post('/logout', authenticate, AuthController.logout)

router.post(
  '/recover-password',
  validateUserStatus,
  body('email')
    .isEmail()
    .withMessage('Email not valid')
    .normalizeEmail()
    .trim(),
  handleInputErrors,
  AuthController.recoverPassword
)

router.patch(
  '/new-password',
  validateUserStatus,
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .trim(),
  body('code')
    .notEmpty()
    .withMessage('Code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Code must be 6 characters long'),
  body('email')
    .isEmail()
    .withMessage('Email not valid')
    .normalizeEmail()
    .trim(),
  handleInputErrors,
  AuthController.newPassword
)

router.put(
  '/update-account',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  uploadAvatarImage.single('image'),
  deletePreviousImage,
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be text')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters')
    .trim(),
  body('surname')
    .notEmpty()
    .withMessage('Surname is required')
    .isString()
    .withMessage('Surname must be text')
    .isLength({ min: 2 })
    .withMessage('Surname must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Surname must not exceed 50 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Email not valid')
    .normalizeEmail()
    .trim(),
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be text')
    .isLength({ min: 7 })
    .withMessage('Phone must be at least 7 characters long')
    .isLength({ max: 20 })
    .withMessage('Phone must not exceed 20 characters')
    .trim(),
  handleInputErrors,
  AuthController.updateAccount
)

router.delete(
  '/delete',
  authenticate,
  validateUserStatus,
  deleteImage,
  AuthController.deleteAccount
)

router.patch(
  '/update-plan',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  AuthController.updatePlan
)

router.get('/user', authenticate, AuthController.user)

export default router
