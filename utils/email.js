const axios = require("axios");

async function sendOTPEmail(email, otp) {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "TS Mart",
                    email: "sainitarun8777@gmail.com",
                },
                to: [
                    {
                        email: email,
                    },
                ],
                subject: "Verify your account",
                htmlContent: `
                    <h2>OTP Verification</h2>
                    <p>Your OTP is:</p>
                    <h1>${otp}</h1>
                    <p>This OTP expires in 1 minute.</p>
                `,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Email sent:", response.data);

    } catch (error) {
        console.log("Email error:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = sendOTPEmail;