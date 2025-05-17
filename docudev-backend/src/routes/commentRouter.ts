import { Router } from 'express'
import { CommentController } from '../controllers/CommentController'
import { limiter } from '../config/limiter'
import { canAccessDocu } from '../middleware/docu'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(limiter)

router.get(
  '/:docuId',
  authenticate,
  canAccessDocu,
  CommentController.getComments
)

router.post(
  '/:docuId',
  authenticate,
  canAccessDocu,
  CommentController.createComment
)

router.delete(
  '/:docuId/:commentId',
  authenticate,
  canAccessDocu,
  CommentController.deleteComment
)

export default router
