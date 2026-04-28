const z = require("zod")
const OTP_TYPES = {
    REGISTER: 1,
    LOGIN: 2,
    FORGOT_PASSWORD: 3,
};

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
        .min(1000, "OTP must be a 4-digit positive number")
        .max(9999, "OTP must be a 4-digit positive number"),
    otpType: z.nativeEnum(OTP_TYPES)
})

module.exports = {
    verifyOtpSchema
};