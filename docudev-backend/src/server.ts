import { config } from 'dotenv'
config()
import express from 'express'
import morgan from 'morgan'
import { connectDB } from './config/db'
import authRouter from './routes/authRouter'
import teamsRouter from './routes/teamsRouter'
import { corsConfig } from './config/cors'
import cors from 'cors'

connectDB()

const app = express()

app.use(cors(corsConfig))

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/teams', teamsRouter)

export default app
