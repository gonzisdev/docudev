import { Router } from 'express'
import { CommentController } from '../controllers/CommentController'
import { limiter } from '../config/limiter'
import { canAccessDocu } from '../middleware/docu'
import { authenticate, validateUserStatus } from '../middleware/auth'

const router = Router()

router.use(limiter)

router.get(
  '/:docuId',
  authenticate,
  validateUserStatus,
  canAccessDocu,
  CommentController.getComments
)

router.post(
  '/:docuId',
  authenticate,
  validateUserStatus,
  canAccessDocu,
  CommentController.createComment
)

router.delete(
  '/:docuId/:commentId',
  authenticate,
  validateUserStatus,
  canAccessDocu,
  CommentController.deleteComment
)

export default router
