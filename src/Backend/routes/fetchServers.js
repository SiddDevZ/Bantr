import { Hono } from 'hono'
import { serverModel } from '../models/servers.js'
import { rateLimiter } from "hono-rate-limiter"

const router = new Hono()

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

router.post('/', limiter, async (c) => {
  const { userServers } = await c.req.json()
  try {
    const servers = await serverModel.find({ _id: { $in: userServers } })
    return c.json(servers, 200)
  } catch (err) {
    return c.json({ message: "Error fetching servers", error: err }, 500)
  }
})

export default router