import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

router.post(
  '/create-account',
  body('name').notEmpty().withMessage('Name is required'),
  body('surname').notEmpty().withMessage('Surname is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('email').isEmail().withMessage('Email not valid'),
  handleInputErrors,
  AuthController.createAccount
)

router.post(
  '/login',
  body('password').notEmpty().withMessage('Password is required'),
  body('email').isEmail().withMessage('Email not valid'),
  handleInputErrors,
  AuthController.login
)

router.post(
  '/recover-password',
  body('email').isEmail().withMessage('Email not valid'),
  handleInputErrors,
  AuthController.recoverPassword
)

router.patch(
  '/new-password',
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('code')
    .notEmpty()
    .withMessage('Code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Code must be 6 characters long'),
  body('email').isEmail().withMessage('Email not valid'),
  handleInputErrors,
  AuthController.newPassword
)

export default router
