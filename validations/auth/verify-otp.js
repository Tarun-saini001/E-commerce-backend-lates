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
    otp: z.string()
        .regex(/^\d{4}$/, "OTP must be exactly 4 digits"),
    otpType: z.nativeEnum(OTP_TYPES),
    name: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
})

module.exports = {
    verifyOtpSchema
};