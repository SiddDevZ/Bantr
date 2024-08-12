import { Hono } from 'hono'
import { userModel } from '../models/users.js'
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
    const body = await c.req.json()
    const user = await userModel.findOne({ _id: body._id })
    const server = await serverModel.findOne({ _id: body.serverId })

    if (!user || !server) {
      return c.json({ message: "User or Server not found" }, 404)
    }

    await userModel.updateOne(
      { _id: body._id },
      { $pull: { joinedServers: body.serverId } }
    )

    await serverModel.updateOne(
      { _id: server._id },
      { $pull: { members: body._id } }
    )

    return c.json({ message: "Server ID removed from user's joined servers" }, 200)
  } catch (err) {
    console.log("Failed to Exit: ", err)
    return c.json({ message: "Internal Server Error" }, 500)
  }
})

export default router