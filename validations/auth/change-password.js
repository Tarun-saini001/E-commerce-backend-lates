const z = require("zod")

const changePasswordSchema = z
    .object({
        oldPassword: z
            .string()
            .trim()
            .nonempty("Current password is required").optional(),

        newPassword: z
            .string()
            .trim()
            .nonempty("New password is required")
            .min(6, "Password must be at least 6 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                "Password must contain uppercase, lowercase, number & special character"
            ),

        confirmPassword: z
            .string()
            .trim()
            .nonempty("Confirm password is required"),
        isResetPassword: z.boolean()
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

module.exports = { changePasswordSchema }
