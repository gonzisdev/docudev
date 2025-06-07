import { Router } from 'express'
import { body } from 'express-validator'
import { NotificationController } from '../controllers/NotificationController'
import { authenticate, validateUserStatus } from '../middleware/auth'
import { handleInputErrors } from '../middleware/validation'
import { updateUserActivity } from '../middleware/lastActivity'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

router.post(
  '/invite',
  authenticate,
  validateUserStatus,
  updateUserActivity,
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
  updateUserActivity,
  NotificationController.respondInvite
)

router.patch(
  '/read/:notificationId',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  NotificationController.markAsRead
)

router.delete(
  '/delete/:notificationId',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  NotificationController.deleteNotification
)

export default router
