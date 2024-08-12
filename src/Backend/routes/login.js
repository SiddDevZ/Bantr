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
  const { email, password } = await c.req.json()
  const user = await userModel.findOne({ email: email })

  if (user) {
    if (user.password === password) {
      return c.json(user.token, 200)
    } else {
      return c.json("Wrong password", 401)
    }
  } else {
    return c.json("User not found", 404)
  }
})

export default router