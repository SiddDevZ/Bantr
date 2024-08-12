import { Hono } from 'hono'
import { userModel } from '../models/users.js'
import { serverModel } from '../models/servers.js'
import { rateLimiter } from "hono-rate-limiter"

const router = new Hono()

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})
router.post('/', limiter, async (c) => {
  const { token, serverId } = await c.req.json()
  
  try {
    const server = await serverModel.findOne({ _id: serverId })
    
    if (server) {
      const user = await userModel.findOne({ token: token })
      
      if (!user) {
        return c.json({ message: "User not found" }, 404)
      }

      if (!user.joinedServers.includes(serverId)) {
        await userModel.findByIdAndUpdate(user._id, {
          $addToSet: { joinedServers: serverId }
        })

        await serverModel.findByIdAndUpdate(serverId, {
          $addToSet: { members: user._id }
        })

        return c.json({ message: "Joined server successfully", server }, 200)
      } else {
        return c.json({ message: "User already in server", server }, 200)
      }
    } else {
      return c.json({ message: "Server not found" }, 404)
    }
  } catch (err) {
    return c.json({ message: "Error fetching Server", error: err }, 500)
  }
})

export default router