import { Router } from 'express'
import { CommentController } from '../controllers/CommentController'
import { limiter } from '../config/limiter'
import { authenticate, validateUserStatus } from '../middleware/auth'
import { canAccessDocu } from '../middleware/docu'
import { updateUserActivity } from '../middleware/lastActivity'

const router = Router()

router.use(limiter)

router.get(
  '/:docuId',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  canAccessDocu,
  CommentController.getComments
)

router.post(
  '/:docuId',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  canAccessDocu,
  CommentController.createComment
)

router.delete(
  '/:docuId/:commentId',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  canAccessDocu,
  CommentController.deleteComment
)

export default router
