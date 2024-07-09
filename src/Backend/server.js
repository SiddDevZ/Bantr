const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const registerRoute = require("./routes/register");
const fetchChannelsRoute = require("./routes/fetchServers");
const makeServerRoute = require("./routes/makeServer");
const makeChannelRoute = require("./routes/makeChannel");
const loginRoute = require("./routes/login");
const googleRoute = require("./routes/googleLogin");
const discordRoute = require("./routes/discordLogin")
const userRoute = require("./routes/fetchUser");

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Bantr");


app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/googlelogin", googleRoute);
app.use("/api/discordlogin", discordRoute);
app.use("/api/fetchservers", fetchChannelsRoute);
app.use("/api/makeserver", makeServerRoute);
app.use("/api/makechannel", makeChannelRoute);
app.use("/api/fetchuser", userRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});