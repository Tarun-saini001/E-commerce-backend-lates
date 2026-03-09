const nodemailer = require("nodemailer");

async function sendOTPEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your account",
        text: `Your OTP is: ${otp}. It expires in 1 minute.`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendOTPEmail
