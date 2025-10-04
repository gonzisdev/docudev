import { config } from 'dotenv'
config()
import express from 'express'
import morgan from 'morgan'
import http from 'http'
import { connectDB } from './config/db'
import authRouter from './routes/authRouter'
import docuRouter from './routes/docuRouter'
import teamRouter from './routes/teamRouter'
import notificationRouter from './routes/notificationRouter'
import statsRouter from './routes/statsRouter'
import commentRouter from './routes/commentRouter'
import imgRouter from './routes/imgRouter'
import { corsConfig } from './config/cors'
import { startUserInactivityJob } from './utils/startUserInactivityJob'
import cookieParser from 'cookie-parser'
import cors from 'cors'

connectDB()

const app = express()
const server = http.createServer(app)

startUserInactivityJob()

app.use(cors(corsConfig))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/docus', docuRouter)
app.use('/api/teams', teamRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/stats', statsRouter)
app.use('/api/comments', commentRouter)
app.use('/api/uploads', imgRouter)

export default server
