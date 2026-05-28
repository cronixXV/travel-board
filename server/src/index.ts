import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { connectDB } from './database'
import authRoutes from './routes/auth'
import placesRoutes from './routes/places'

const app = express()

app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/places', placesRoutes)

const start = async () => {
  await connectDB()
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`)
  })
}

start()