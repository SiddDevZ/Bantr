const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const googleRoute = require("./routes/google_login");
const discordRoute = require("./routes/discord_login")

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017");


app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/googlelogin", googleRoute);
app.use("/discordlogin", discordRoute)

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});