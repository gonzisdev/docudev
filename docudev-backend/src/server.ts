import { config } from 'dotenv'
config()
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import http from 'http'
import { connectDB } from './config/db'
import authRouter from './routes/authRouter'
import teamsRouter from './routes/teamsRouter'
import docuRouter from './routes/docuRouter'
import { corsConfig, publicCorsConfig } from './config/cors'
import cors from 'cors'

connectDB()

const app = express()
const server = http.createServer(app)

const uploadsPath = path.join(__dirname, '..', 'uploads')
app.use('/api/uploads', cors(publicCorsConfig), express.static(uploadsPath))

app.use(cors(corsConfig))

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/docus', docuRouter)

export default server
