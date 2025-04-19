import { Router } from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'
import { authenticate } from '../middleware/auth'
import { DocuController } from '../controllers/DocuController'

const router = Router()

router.use(limiter)

router.post(
  '/create-docu',
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
  authenticate,
  handleInputErrors,
  DocuController.createDocu
)

router.get('/', authenticate, DocuController.getDocus)

router.get('/:docuId', authenticate, DocuController.getDocu)

router.put(
  '/update-docu/:docuId',
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
  authenticate,
  handleInputErrors,
  DocuController.updateDocu
)

router.delete('/delete-docu/:docuId', authenticate, DocuController.deleteDocu)

export default router
