const z = require("zod")

const sendOtpSchema = z.object({
    email: z
        .string()
        .trim()
        .nonempty("Email is required")
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/,
            "Invalid email format"
        ),
    otpType: z.enum([1, 2, 3])
})

module.exports = {
        sendOtpSchema,
};