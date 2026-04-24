const z = require("zod");


const productSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .min(2, "Title must be at least 2 characters")
        .max(20, "Name is Too Long..."),

    description: z
        .string()
        .trim()
        .min(1, "Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(200, "Too Long Description.."),

    price: z
        .coerce.number()
        .refine((val) => val !== 0, {
            message: "Price cannot be zero",
        })
        .refine((val) => val > 0, {
            message: "Price cannot be negative",
        }),

    stock: z
        .coerce.number()
        .refine((val) => Number.isFinite(val), {
            message: "Stock must be a valid number",
        })
        .min(0, {
            message: "Stock cannot be negative",
        }),


    category: z
        .string()
        .trim(),

   
});

module.exports={productSchema}