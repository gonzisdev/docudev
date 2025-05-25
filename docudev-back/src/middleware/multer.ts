import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { generateUniqueId } from '../utils/generateUniqueId'
import User from '../models/User'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length
    )
    cb(null, `${generateUniqueId()}${extension}`)
  }
})

export const upload = multer({ storage: storage })

export const deletePreviousImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (user && user.image && req.file) {
      const previousImageName = user.image
      const uploadPath = path.join(path.resolve(), 'uploads', previousImageName)

      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath)
      }
    }
    next()
  } catch (error) {
    console.error('Error deleting the previous image:', error)
    next(error)
  }
}

export const deleteImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (user && user.image) {
      const previousImageName = user.image
      const uploadPath = path.join(path.resolve(), 'uploads', previousImageName)

      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath)
      }
    }
    next()
  } catch (error) {
    console.error('Error deleting the previous image:', error)
    next(error)
  }
}
