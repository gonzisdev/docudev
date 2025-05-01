import mongoose from 'mongoose'
import colors from 'colors'

// Función para conectar a MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI
    await mongoose.connect(mongoURI)
    console.log(
      colors.magenta.bold('MongoDB connection established successfully')
    )
  } catch (error) {
    console.error(colors.red.bold('Error connecting DDBB:'), error)
    process.exit(1)
  }
}

export const db = mongoose
