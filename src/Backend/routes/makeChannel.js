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
  try {
    const { serverId, newChannelName: channelName, channelType } = await c.req.json()

    if (!serverId || !channelName || !channelType) {
      console.log(serverId, channelName, channelType)
      return c.json({ message: "Missing required fields" }, 400)
    }

    const server = await serverModel.findById(serverId)

    if (!server) {
      return c.json({ message: "Server not found" }, 404)
    }

    const newChannel = {
      channelId: Math.floor(Math.random() * 10000000000000),
      channelName: channelName,
      type: channelType
    }

    server.channels.push(newChannel)

    await server.save()

    return c.json("Channel created successfully", 201)
  } catch (error) {
    console.error("Error creating channel: ", error)
    return c.json({ message: "Internal server error" }, 500)
  }
})

export default router