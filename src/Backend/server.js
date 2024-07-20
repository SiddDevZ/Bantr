const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Bantr");

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


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join channel', (channelId) => {
    socket.join(channelId);
    console.log(`Client joined channel: ${channelId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});