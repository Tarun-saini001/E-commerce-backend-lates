
const {z} = require("zod")

// Order Item Schema
 const orderItemSchema = z.object({
    id: z.number().int().positive({ message: "Product ID must be a positive integer" }),

    title: z.string()
        .min(2, { message: "Title must be at least 2 characters" })
        .max(200, { message: "Title too long" }),

    price: z.number()
        .positive({ message: "Price must be greater than 0" }),

    thumbnail: z.string()
        .url({ message: "Thumbnail must be a valid URL" })
        .optional(),

    brand: z.string().max(100).optional(),

    category: z.string().max(100).optional(),

    quantity: z.number()
        .int()
        .min(1, { message: "Quantity must be at least 1" })
        .max(100, { message: "Quantity too large" }),
});


// Billing Schema
 const billingSchema = z.object({
    name: z.string()
        .min(2, { message: "Name is required" })
        .max(100).optional(),

    country: z.string()
        .min(2, { message: "Country is required" }),

    city: z.string()
        .min(2, { message: "City is required" }),

    district: z.string()
        .min(2, { message: "District is required" }),

    postalCode: z.string()
        .regex(/^[0-9]{4,10}$/, { message: "Invalid postal code" }),

    address: z.string()
        .min(5, { message: "Address is too short" })
        .max(300),

    phone: z.string()
        .regex(/^\+?\d{10,14}$/, { message: "Invalid phone number" }).optional(), // Indian format

    email: z.string()
        .email({ message: "Invalid email address" }).optional(),
});


// Main Order Schema
 const orderSchema = z.object({

    billingDetails: billingSchema.optional(),

    items: z.array(orderItemSchema)
        .min(1, { message: "At least one item is required" }).optional(),

    shippingMethod: z.enum(["upi", "cod"], {
        errorMap: () => ({ message: "Invalid shipping method" }),
    }).default("cod"),

    orderStatus: z.enum(["pending", "processing", "completed"])
        .default("pending"),
})

module.exports = {
    orderItemSchema,
    billingSchema,
    orderSchema,
};