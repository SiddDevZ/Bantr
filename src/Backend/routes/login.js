const express = require("express");
const userModel = require("../models/users");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 120,
    message: "Too many login attempts from this IP, please try again after 15 minutes"
});


router.post("/", loginLimiter, async (req, res) => {
    const {email, password} = req.body;
    userModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password) {
                res.status(200).json(user.token);
            } else{
                res.status(401).json("Wrong password");
            }
        } else{
            res.status(404).json("User not found");
        }
    })
});

module.exports = router;