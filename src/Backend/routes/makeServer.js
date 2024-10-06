import { Hono } from 'hono'
import { serverModel } from '../models/servers.js'
import { userModel } from '../models/users.js'
import { rateLimiter } from "hono-rate-limiter"

const router = new Hono()

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

router.post('/', limiter, async (c) => {
  const { owner, name } = await c.req.json()
  const serverId = Math.floor(Math.random() * 10000000000000)

  const newServer = new serverModel({
    _id: serverId,
    serverName: name,
    color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
    owner: owner,
    members: [],
    channels: [
      {
        channelId: Math.floor(Math.random() * 10000000000000),
        channelName: 'Announcements',
        type: 'server'
      },
      {
        channelId: Math.floor(Math.random() * 10000000000000),
        channelName: 'Rules',
        type: 'server'
      },
      {
        channelId: Math.floor(Math.random() * 10000000000000),
        channelName: 'Public Chat',
        type: 'public'
      },
      {
        channelId: Math.floor(Math.random() * 10000000000000),
        channelName: 'Memes',
        type: 'public'
      }
    ]
  })

  try {
    await newServer.save()
    await userModel.findByIdAndUpdate(owner, {
      $addToSet: { joinedServers: serverId }
    })
    return c.json({ serverId: newServer._id }, 200)
  } catch (err) {
    console.error(err)
    return c.json(err, 500)
  }
})

export default router