const { z } = require("zod")

const updateUserSchema = z.object({
        name: z
                .string()
                .trim()
                .nonempty("Name is required")
                .min(1, "Name is required")
                .min(2, "Name must be at least 2 characters")
                .max(15, "Name is too long")
                .regex(/^[A-Z]/, "Name must start with a capital letter")
                .regex(/^[A-Za-z\s]*$/, "Name must contain only letters")
})
module.exports = {
        updateUserSchema,
};