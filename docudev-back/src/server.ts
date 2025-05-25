import { config } from 'dotenv'
config()
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import http from 'http'
import { connectDB } from './config/db'
import authRouter from './routes/authRouter'
import docuRouter from './routes/docuRouter'
import teamRouter from './routes/teamRouter'
import notificationRouter from './routes/notificationRouter'
import statsRouter from './routes/statsRouter'
import commentRouter from './routes/commentRouter'
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
app.use('/api/docus', docuRouter)
app.use('/api/teams', teamRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/stats', statsRouter)
app.use('/api/comments', commentRouter)

export default server
