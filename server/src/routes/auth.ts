import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../database/models/user'
import { RegisterSchema, LoginSchema } from '@wanderboard/shared/schemas/auth.schema'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt'
import { authenticate } from '../middleware/authenticate'

const router = Router()

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

router.post('/register', async (req: Request, res: Response) => {
  const parsed = RegisterSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message })
    return
  }

  const { email, password, username } = parsed.data

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      res.status(409).json({ error: 'Email уже занят' })
      return
    }

    const existingUsername = await User.findOne({ where: { username } })
    if (existingUsername) {
      res.status(409).json({ error: 'Username уже занят' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email, passwordHash, username })

    const payload = { userId: user.id, username: user.username }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
    res.status(201).json({
      accessToken,
      user: { id: user.id, email: user.email, username: user.username },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message })
    return
  }

  const { email, password } = parsed.data

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      res.status(401).json({ error: 'Неверный email или пароль' })
      return
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      res.status(401).json({ error: 'Неверный email или пароль' })
      return
    }

    const payload = { userId: user.id, username: user.username }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
    res.json({
      accessToken,
      user: { id: user.id, email: user.email, username: user.username },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.post('/refresh', async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken
  if (!token) {
    res.status(401).json({ error: 'Refresh токен не найден' })
    return
  }

  try {
    const payload = verifyRefreshToken(token)
    const user = await User.findByPk(payload.userId)
    if (!user) {
      res.status(401).json({ error: 'Пользователь не найден' })
      return
    }

    const newPayload = { userId: user.id, username: user.username }
    const accessToken = generateAccessToken(newPayload)
    const refreshToken = generateRefreshToken(newPayload)

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
    res.json({ accessToken })
  } catch {
    res.status(401).json({ error: 'Refresh токен недействителен' })
  }
})

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('refreshToken')
  res.json({ message: 'Вышли успешно' })
})

router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.userId, {
      attributes: ['id', 'email', 'username', 'createdAt'],
    })
    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' })
      return
    }
    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default router