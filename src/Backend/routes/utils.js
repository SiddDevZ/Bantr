const nodemailer = require("nodemailer");
require('dotenv').config();


const sendMail = async (userEmail, verificationLink) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: 'siddz.dev@gmail.com',
            to: userEmail,
            subject: 'Account Verification',
            text: `Please verify your account by clicking the following link:\n\n${verificationLink}`,
        };
        
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { sendMail };