const express = require("express");
const userModel = require("../models/users");
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

        const token = crypto.randomBytes(24).toString("hex");

        const newUser = new userModel({
          username: name,
          email: req.body.email,
          password: token,
          token: token,
          verificationToken: "none_required",
          verified: true,
        });

        await newUser.save();
        res.status(200).json(token);
    }
  } catch (error) {
    console.error('Discord login error:', error);
    res.status(500).json({ error: "Internal server error" });

  }
});

module.exports = router;