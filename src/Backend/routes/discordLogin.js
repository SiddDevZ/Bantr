import { Hono } from 'hono'
import { userModel } from '../models/users.js'
import { serverModel } from '../models/servers.js'
import crypto from 'crypto'

const router = new Hono()

router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const user = await userModel.findOne({ email: body.email })

    let name = ''
    try {
      name = body.global_name || body.username
    } catch {
      name = body.username
    }

    if (user) {
      return c.json(user.token, 200)
    } else {
      const defaultServers = process.env.DEFAULT_SERVERS.split(',')
      const token = crypto.randomBytes(24).toString('hex')
      const userId = Math.floor(Math.random() * 10000000000000)

      const avatar = `https://cdn.discordapp.com/avatars/${body.id}/${body.avatar}.png`

      const newUser = new userModel({
        _id: userId,
        username: name,
        email: body.email,
        password: token,
        token: token,
        verificationToken: 'none_required',
        verified: true,
        avatar: avatar,
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
        joinedServers: defaultServers,
      })

      await newUser.save()

      for (const serverId of defaultServers) {
        await serverModel.findByIdAndUpdate(serverId, {
          $addToSet: { members: userId }
        })
      }

      return c.json(token, 200)
    }
  } catch (error) {
    console.error('Discord login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default router