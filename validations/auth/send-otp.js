const z = require("zod")

const OTP_TYPES = {
    REGISTER: 1,
    LOGIN: 2,
    FORGOT_PASSWORD: 3,
};

const sendOtpSchema = z.object({
    email: z
        .string()
        .trim()
        .nonempty("Email is required")
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/,
            "Invalid email format"
        ),
    otpType: z.nativeEnum(OTP_TYPES)
})

module.exports = {
    sendOtpSchema,
};