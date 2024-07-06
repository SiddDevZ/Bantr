const express = require("express");
const userModel = require("../models/users");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 120,
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});


router.post("/", loginLimiter, async (req, res) => {

    try{
        const user = await userModel.findOne({email: req.body.email})
        if (user){
            res.status(200).json(user.token);

        } else{

            const token = crypto.randomBytes(24).toString("hex");

            const newUser = new userModel({
                username: req.body.given_name[0].toUpperCase() + req.body.given_name.slice(1),
                email: req.body.email,
                password: token,
                token: token,
                verificationToken: "none_required",
                verified: true,
            });

            await newUser.save()

            res.status(200).json(token);
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;