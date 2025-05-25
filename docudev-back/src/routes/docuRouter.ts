import { Router } from 'express'
import { body } from 'express-validator'
import { DocuController } from '../controllers/DocuController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate, validateUserStatus } from '../middleware/auth'
import { canAccessDocu } from '../middleware/docu'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

router.post(
  '/create-docu',
  authenticate,
  validateUserStatus,
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
  '/:docuId',
  authenticate,
  validateUserStatus,
  canAccessDocu,
  DocuController.getDocu
)

router.put(
  '/update-docu/:docuId',
  authenticate,
  validateUserStatus,
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

router.delete(
  '/delete-docu/:docuId',
  authenticate,
  validateUserStatus,
  canAccessDocu,
  DocuController.deleteDocu
)

export default router
