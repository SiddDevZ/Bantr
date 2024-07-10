const express = require("express");
const userModel = require("../models/users");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const { sendMail } = require("./utils");

const router = express.Router();
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 120,
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});

router.post("/", registerLimiter, async (req, res) => {
    try {

        const user = await userModel.findOne({ email: req.body.email });

        if (user) {
            res.status(400).json("Email already exists");
        }
        else{
            const verificationToken = crypto.randomBytes(12).toString("hex");
            const token = crypto.randomBytes(24).toString("hex");

            const newUser = new userModel({
                _id: Math.floor(Math.random() * 10000000000000),
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                token: token,
                verificationToken: verificationToken,
                verified: false,
                joinedServers: [4096277408633, 9854722554976],
            });

            newUser.save()

            res.status(200).json(token);

            const verificationLink = `http://yourdomain.com/verify?token=${verificationToken}`;
            await sendMail(newUser.email, verificationLink);

            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json("error");
        }
});

module.exports = router;