const express = require("express");
const userModel = require("../models/users");
const serverModel = require("../models/servers");
const crypto = require("crypto");
const router = express.Router();

router.post("/", async (req, res) => {
  try {

    const user = await userModel.findOne({ email: req.body.email });

    let name = "";
    try{if (req.body.global_name) {name = req.body.global_name
    } else {name = req.body.username}} catch {name = req.body.username}

    if (user) {

        res.status(200).json(user.token);

    } else {
        const defaultServers = process.env.DEFAULT_SERVERS.split(",");
        const token = crypto.randomBytes(24).toString("hex");
        const userId = Math.floor(Math.random() * 10000000000000);

        const avatar = `https://cdn.discordapp.com/avatars/${req.body.id}/${req.body.avatar}.png`

        const newUser = new userModel({
          _id: userId,
          username: name,
          email: req.body.email,
          password: token,
          token: token,
          verificationToken: "none_required",
          verified: true,
          avatar: avatar,
          color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
          joinedServers: defaultServers,
        });

        await newUser.save();

        defaultServers.forEach(async (serverId) => {
            await serverModel.findByIdAndUpdate(serverId, {
                $addToSet: { members: userId }
            });
        });
        res.status(200).json(token);
    }
  } catch (error) {
    console.error('Discord login error:', error);
    res.status(500).json({ error: "Internal server error" });

  }
});

module.exports = router;