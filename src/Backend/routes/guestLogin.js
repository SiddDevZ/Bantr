import { Hono } from 'hono'
import { userModel } from '../models/users.js'
import { serverModel } from '../models/servers.js'
import crypto from 'crypto'
import { rateLimiter } from "hono-rate-limiter"

const router = new Hono()

const guestLoginLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

router.post('/', guestLoginLimiter, async (c) => {
  try {
    const { name } = await c.req.json()

    const userId = Math.floor(Math.random() * 10000000000000)
    const token = crypto.randomBytes(24).toString("hex")
    const defaultServers = process.env.DEFAULT_SERVERS.split(",")
    const verificationToken = crypto.randomBytes(12).toString("hex")

    const guestUser = new userModel({
      _id: userId,
      username: `${name}`,
      email: `guest_${userId}@placeholder.com`,
      password: crypto.randomBytes(16).toString("hex"),
      token: token,
      verificationToken: verificationToken,
      verified: true,
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
      joinedServers: defaultServers,
    })

    await guestUser.save()

    for (const serverId of defaultServers) {
      await serverModel.findByIdAndUpdate(serverId, {
        $addToSet: { members: userId },
      })
    }

    return c.json(token, 200)
  } catch (error) {
    console.error("Error:", error)
    return c.json("error", 500)
  }
})

export default router