import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { connectDB } from './database'
import authRoutes from './routes/auth'
import placesRoutes from './routes/places'
import photosRoutes from './routes/photos'
import { UPLOADS_DIR } from './config/paths'

const app = express()

app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

console.log('Uploads static dir:', UPLOADS_DIR)

app.use('/uploads', express.static(UPLOADS_DIR))

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/places', placesRoutes)
app.use('/api/places', photosRoutes)

const start = async () => {
  await connectDB()
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`)
  })
}

start()