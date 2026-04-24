const z = require("zod")

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .nonempty("Email is required")
        .email("Invalid email format"), // only validate format
    password: z.string().nonempty("Password is required"), // only required
});

module.exports={
    loginSchema
}