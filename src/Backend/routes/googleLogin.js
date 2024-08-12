import { Hono } from 'hono'
import { userModel } from '../models/users.js'
import { serverModel } from '../models/servers.js'
import crypto from 'crypto'
import { rateLimiter } from "hono-rate-limiter"

const router = new Hono()

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

router.post('/', limiter, async (c) => {
  try {
    const { email, given_name, picture } = await c.req.json()
    const user = await userModel.findOne({ email })

    if (user) {
      return c.json(user.token, 200)
    } else {
      const userId = Math.floor(Math.random() * 10000000000000)
      const token = crypto.randomBytes(24).toString("hex")
      const defaultServers = process.env.DEFAULT_SERVERS.split(",")

      const newUser = new userModel({
        _id: userId,
        username: given_name[0].toUpperCase() + given_name.slice(1),
        email,
        password: token,
        token,
        verificationToken: "none_required",
        verified: true,
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
        avatar: picture,
        joinedServers: defaultServers,
      })

      await newUser.save()

      for (const serverId of defaultServers) {
        await serverModel.findByIdAndUpdate(serverId, {
          $addToSet: { members: userId }
        })
      }

      return c.json(token, 200)
    }
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: "Internal server error" }, 500)
  }
})

export default router