import { Hono } from 'hono'
import { userModel } from '../models/users.js'

const router = new Hono()

router.post('/', async (c) => {
  try {
    const { currentMembers } = await c.req.json()
    const members = await userModel.find(
      { _id: { $in: currentMembers } },
      '_id username avatar color'
    )
    return c.json(members, 200)
  } catch (error) {
    return c.text(error.message, 500)
  }
})

export default router