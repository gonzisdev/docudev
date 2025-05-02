import { Router } from 'express'
import { body } from 'express-validator'
import { NotificationController } from '../controllers/NotificationController'
import { authenticate, validateUserStatus } from '../middleware/auth'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

router.post(
  '/invite',
  authenticate,
  validateUserStatus,
  body('email')
    .isEmail()
    .withMessage('Email not valid')
    .normalizeEmail()
    .trim(),
  handleInputErrors,
  NotificationController.sendInvite
)

router.get('/', authenticate, NotificationController.getNotifications)

router.patch(
  '/respond/:notificationId',
  authenticate,
  validateUserStatus,
  NotificationController.respondInvite
)

router.patch(
  '/read/:notificationId',
  authenticate,
  validateUserStatus,
  NotificationController.markAsRead
)

router.delete(
  '/delete/:notificationId',
  authenticate,
  validateUserStatus,
  NotificationController.deleteNotification
)

export default router
