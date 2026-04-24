const z = require("zod")

const verifyOtpSchema = z.object({
    email: z
        .string()
        .trim()
        .nonempty("Email is required")
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/,
            "Invalid email format"
        ),
    otp: z.number()
        .int("OTP must be an integer")
        .min(100000, "OTP must be a 6-digit positive number")
        .max(999999, "OTP must be a 6-digit positive number"),
    otpType: z.enum([1, 2, 3])
})

module.exports = {
    verifyOtpSchema
};