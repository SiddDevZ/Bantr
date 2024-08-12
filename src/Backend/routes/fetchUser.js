import { Hono } from 'hono'
import { userModel } from '../models/users.js'
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
    const { token } = await c.req.json()
    const user = await userModel.findOne({ token })
    return c.json(user, 200)
  } catch (err) {
    return c.json({ message: "Error fetching user", error: err }, 500)
  }
})

export default router