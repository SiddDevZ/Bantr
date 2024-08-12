import { Hono } from 'hono'
import { messageModel } from '../models/chats.js'
import { rateLimiter } from "hono-rate-limiter"

const router = new Hono()

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 2200,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

router.post('/', limiter, async (c) => {
  try {
    const { page = 1, channelId } = await c.req.json()

    if (!channelId) {
      return c.json({ message: "Channel ID is required" }, 400)
    }

    const messages = await messageModel.find({ channelId: channelId })
      .sort({ timestamp: 1 })

    return c.json(messages, 200)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return c.json({ message: "Internal server error" }, 500)
  }
})

export default router