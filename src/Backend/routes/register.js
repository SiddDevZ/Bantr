import { Hono } from 'hono'
import { userModel } from '../models/users.js'
import { serverModel } from '../models/servers.js'
import crypto from 'crypto'
import { rateLimiter } from "hono-rate-limiter"

const router = new Hono()

const registerLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

router.post('/', registerLimiter, async (c) => {
  try {
    const { email, username, password } = await c.req.json()
    const user = await userModel.findOne({ email: email })

    if (user) {
      return c.json("Email already exists", 400)
    } else {
      const verificationToken = crypto.randomBytes(12).toString("hex")
      const userId = Math.floor(Math.random() * 10000000000000)
      const token = crypto.randomBytes(24).toString("hex")
      const defaultServers = process.env.DEFAULT_SERVERS.split(",")

      const newUser = new userModel({
        _id: userId,
        username: username,
        email: email,
        password: password,
        token: token,
        verificationToken: verificationToken,
        verified: false,
        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
        joinedServers: defaultServers,
      })

      await newUser.save()

      for (const serverId of defaultServers) {
        await serverModel.findByIdAndUpdate(serverId, {
          $addToSet: { members: userId },
        })
      }

      const verificationLink = `http://yourdomain.com/verify?token=${verificationToken}`
      // await sendMail(newUser.email, verificationLink)

      return c.json(token, 200)
    }
  } catch (error) {
    console.error("Error:", error)
    return c.json("error", 500)
  }
})

export default router