import { Router } from 'express'
import { body } from 'express-validator'
import { DocuController } from '../controllers/DocuController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate, validateUserStatus } from '../middleware/auth'
import { canAccessDocu } from '../middleware/docu'
import { updateUserActivity } from '../middleware/lastActivity'
import { limiter } from '../config/limiter'
import { uploadDocuImage } from '../middleware/multer'

const router = Router()

router.use(limiter)

router.post(
  '/create-docu',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  body('title')
    .notEmpty()
    .withMessage('Docu title is required')
    .isString()
    .withMessage('Docu title must be text')
    .isLength({ min: 2 })
    .withMessage('Docu title must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Docu title cannot exceed 50 characters')
    .trim(),
  body('content').notEmpty().withMessage('Docu content is required'),
  handleInputErrors,
  DocuController.createDocu
)

router.get('/', authenticate, DocuController.getDocus)

router.get(
  '/counts',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  DocuController.getDocuCounts
)

router.get(
  '/:docuId',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  canAccessDocu,
  DocuController.getDocu
)

router.put(
  '/update-docu/:docuId',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  canAccessDocu,
  body('title')
    .notEmpty()
    .withMessage('Docu title is required')
    .isString()
    .withMessage('Docu title must be text')
    .isLength({ min: 2 })
    .withMessage('Docu title must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Docu title cannot exceed 50 characters')
    .trim(),
  body('content').notEmpty().withMessage('Docu content is required'),
  handleInputErrors,
  DocuController.updateDocu
)

router.patch(
  '/remove-from-team/:docuId',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  canAccessDocu,
  DocuController.removeFromTeam
)

router.delete(
  '/delete-docu/:docuId',
  authenticate,
  validateUserStatus,
  updateUserActivity,
  canAccessDocu,
  DocuController.deleteDocu
)

router.post(
  '/:docuId/images',
  authenticate,
  validateUserStatus,
  canAccessDocu,
  uploadDocuImage.single('image'),
  DocuController.uploadDocuImage
)

router.get(
  '/:docuId/images',
  authenticate,
  validateUserStatus,
  canAccessDocu,
  DocuController.getDocuImages
)

router.delete(
  '/:docuId/images/:filename',
  authenticate,
  validateUserStatus,
  canAccessDocu,
  DocuController.deleteDocuImage
)

export default router
