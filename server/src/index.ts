import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { connectDB } from './database'

const app = express()

app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json())

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const start = async () => {
  await connectDB()
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`)
  })
}

start()