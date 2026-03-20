const nodemailer = require("nodemailer");

async function sendOTPEmail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"TS Mart" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Verify your account",
            html: `
                <h2>OTP Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP expires in 1 minute.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP Email sent");

    } catch (error) {
        console.log("Email error:", error);
        throw error;
    }
}

module.exports = sendOTPEmail;