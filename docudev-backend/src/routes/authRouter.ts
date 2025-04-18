import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'
import { authenticate } from '../middleware/auth'

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
  body('password').notEmpty().withMessage('Password is required').trim(),
  body('email').isEmail().withMessage('Email not valid').trim(),
  handleInputErrors,
  AuthController.login
)

router.post(
  '/recover-password',
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

router.get('/user', authenticate, AuthController.user)

export default router
