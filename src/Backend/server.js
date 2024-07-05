const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017");

app.use("/register", registerRoute);
app.use("/login", loginRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});