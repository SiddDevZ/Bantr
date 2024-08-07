const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const onlineUsers = new Set();
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://siddarthmeena2:BDQbYKkjVGwv7MKq@cluster0.aq531bc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const googleRoute = require("./routes/googleLogin");
const discordRoute = require("./routes/discordLogin");
const fetchChannelsRoute = require("./routes/fetchServers");
const makeServerRoute = require("./routes/makeServer");
const makeChannelRoute = require("./routes/makeChannel");
const userRoute = require("./routes/fetchUser");
const inviteRoute = require("./routes/invite");
const getMembersRoute = require("./routes/getMembers");
const sendMessageRoute = require("./routes/sendMessage");
const getMessagesRoute = require("./routes/getMessages");
const getMessageUserDetailsRoute = require("./routes/getMessageUser");
const exitServerRoute = require("./routes/exitServer");

app.set('io', io);
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/googlelogin", googleRoute);
app.use("/api/discordlogin", discordRoute);
app.use("/api/fetchservers", fetchChannelsRoute);
app.use("/api/makeserver", makeServerRoute);
app.use("/api/makechannel", makeChannelRoute);
app.use("/api/fetchuser", userRoute);
app.use("/api/invite", inviteRoute);
app.use("/api/getmembers", getMembersRoute);
app.use("/api/sendmessage", sendMessageRoute);
app.use("/api/getmessages", getMessagesRoute);
app.use("/api/getmsgusers", getMessageUserDetailsRoute);
app.use("/api/exitserver", exitServerRoute);
app.post('/api/getonlineusers', (req, res) => {
  res.json(Array.from(onlineUsers));
});
app.post("/", async (req, res) => {
  res.json({message: "Hello world"})
})

io.on('connection', (socket) => {
  console.log('New client connected');
  let connectedUserId;

  socket.on('user connected', (userId) => {
    console.log(`User connected: ${userId}`);
    connectedUserId = userId;
    onlineUsers.add(userId);
    io.emit('user status changed', { userId, status: 'online' });
  });

  socket.on('join channel', (channelId) => {
    socket.join(channelId);
    console.log(`Client joined channel: ${channelId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (connectedUserId) {
      console.log(onlineUsers)
      onlineUsers.delete(connectedUserId);
      console.log(onlineUsers)
      io.emit('user status changed', { userId: connectedUserId, status: 'offline' });
    }
  });

});

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});