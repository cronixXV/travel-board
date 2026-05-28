import { Sequelize } from 'sequelize-typescript'
import { env } from '../config/env'
import { User } from './models/user'
import { Place } from './models/place'
import { PlacePhoto } from './models/place-photo'

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  models: [User, Place, PlacePhoto],
})

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connected')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    process.exit(1)
  }
}