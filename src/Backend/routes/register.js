const express = require("express");
const userModel = require("../models/users");
const serverModel = require("../models/servers");
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
            const userId = Math.floor(Math.random() * 10000000000000);
            const token = crypto.randomBytes(24).toString("hex");
            const defaultServers = process.env.DEFAULT_SERVERS.split(",");

            const newUser = new userModel({
                _id: userId,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                token: token,
                verificationToken: verificationToken,
                verified: false,
                color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
                joinedServers: defaultServers,
            });

            newUser.save()

            defaultServers.forEach(async (serverId) => {
                await serverModel.findByIdAndUpdate(serverId, {
                    $addToSet: { members: userId }
                });
            });

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