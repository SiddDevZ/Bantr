import { Hono } from 'hono'
import { userModel } from '../models/users.js'
import { rateLimiter } from "hono-rate-limiter"

const router = new Hono()

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 20120,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

router.post('/', limiter, async (c) => {
  const { messages: messageList } = await c.req.json()

  try {
    const userIds = [...new Set(messageList.map(message => message.userId))]

    const users = await userModel.find({ _id: { $in: userIds } }, 'username avatar color').exec()

    const userMap = users.reduce((map, user) => {
      map[user._id] = user
      return map
    }, {})

    const messagesWithUserDetails = messageList.map(message => {
      const user = userMap[message.userId]
      return {
        userId: message.userId,
        username: user.username,
        avatar: user.avatar,
        color: user.color
      }
    })

    return c.json(messagesWithUserDetails, 200)
  } catch (error) {
    console.error(error)
    return c.json({ error: "An error occurred while processing the request." }, 500)
  }
})

export default router