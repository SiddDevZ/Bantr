import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import { serve } from '@hono/node-server'
import { config } from 'dotenv'

config()

const app = new Hono()
const onlineUsers = new Set()

app.use('*', cors())

const dbUrl = process.env.DATABASE_URL
mongoose.connect(dbUrl);

import registerRoute from './routes/register.js'
import loginRoute from './routes/login.js'
import googleRoute from './routes/googleLogin.js'
import discordRoute from './routes/discordLogin.js'
import fetchChannelsRoute from './routes/fetchServers.js'
import makeServerRoute from './routes/makeServer.js'
import makeChannelRoute from './routes/makeChannel.js'
import userRoute from './routes/fetchUser.js'
import inviteRoute from './routes/invite.js'
import getMembersRoute from './routes/getMembers.js'
import sendMessageRoute from './routes/sendMessage.js'
import getMessagesRoute from './routes/getMessages.js'
import getMessageUserDetailsRoute from './routes/getMessageUser.js'
import exitServerRoute from './routes/exitServer.js'
import guestLoginRoute from './routes/guestLogin.js'

app.route('/api/register', registerRoute)
app.route('/api/login', loginRoute)
app.route('/api/googlelogin', googleRoute)
app.route('/api/discordlogin', discordRoute)
app.route('/api/fetchservers', fetchChannelsRoute)
app.route('/api/makeserver', makeServerRoute)
app.route('/api/makechannel', makeChannelRoute)
app.route('/api/fetchuser', userRoute)
app.route('/api/invite', inviteRoute)
app.route('/api/getmembers', getMembersRoute)
app.route('/api/sendmessage', sendMessageRoute)
app.route('/api/getmessages', getMessagesRoute)
app.route('/api/getmsgusers', getMessageUserDetailsRoute)
app.route('/api/exitserver', exitServerRoute)
app.route('/api/guestlogin', guestLoginRoute)

app.post('/api/getonlineusers', (c) => c.json(Array.from(onlineUsers)))

app.get('/', (c) => c.json({ message: "Hello world" }))

const port = process.env.PORT || 4000
const server = serve({ fetch: app.fetch, port })

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log('New client connected')
  let connectedUserId

  socket.on('user connected', (userId) => {
    console.log(`User connected: ${userId}`)
    connectedUserId = userId
    onlineUsers.add(userId)
    io.emit('user status changed', { userId, status: 'online' })
  })

  socket.on('join channel', (channelId) => {
    socket.join(channelId)
    console.log(`Client joined channel: ${channelId}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
    if (connectedUserId) {
      console.log(onlineUsers)
      onlineUsers.delete(connectedUserId)
      console.log(onlineUsers)
      io.emit('user status changed', { userId: connectedUserId, status: 'offline' })
    }
  })
})

export { io };
console.log(`Server running at http://localhost:${port}`)