import mongoose from 'mongoose'
import colors from 'colors'

// Función para conectar a MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI
    await mongoose.connect(mongoURI)
    console.log(
      colors.magenta.bold('Conexión a MongoDB establecida correctamente')
    )
  } catch (error) {
    console.error(
      colors.red.bold('Error al conectar a la base de datos:'),
      error
    )
    process.exit(1)
  }
}

// Exportamos la instancia de mongoose para usarla en la aplicación
export const db = mongoose
