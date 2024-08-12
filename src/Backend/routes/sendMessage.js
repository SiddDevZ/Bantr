import { Hono } from 'hono'
import { messageModel } from '../models/chats.js'
import { rateLimiter } from "hono-rate-limiter"
import { io } from '../server.js'

const router = new Hono()

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

router.post('/', limiter, async (c) => {
  try {
    const { message, userName, channelId, userId } = await c.req.json()
    const now = new Date()
    const newMessage = new messageModel({
      _id: Math.floor(Math.random() * 1000000000000000),
      message,
      username: userName,
      channelId,
      timestamp: now,
      userId,
    })

    await newMessage.save()

    // Note: You'll need to implement WebSocket functionality separately in Hono
    // This line is a placeholder and won't work as-is
    // c.get('io').to(channelId).emit('new message')
    io.to(channelId).emit('new message', newMessage)

    return c.json(newMessage, 200)
  } catch (error) {
    console.log(error)
    return c.json(error, 500)
  }
})

export default router