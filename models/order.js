const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        title: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        discountPercentage: { type: Number },
        rating: { type: Number },
        brand: { type: String },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        categoryName: { type: String },
        thumbnail: { type: String },

        quantity: { type: Number, required: true, min: 1 },

        // optional but very useful
        totalPrice: { type: Number },
    },
    { _id: false }
);

const billingSchema = new mongoose.Schema(
    {
        name: { type: String },
        country: { type: String },
        city: { type: String },
        district: { type: String },
        postalCode: { type: String },
        address: { type: String },
        phone: { type: String },
        email: { type: String },
    },
    { _id: false }
);


const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

        billingDetails: billingSchema,

        items: [orderItemSchema],

        shippingMethod: { type: String, enum: ["upi", "cod"], default: "cod", },
        subtotal: { type: Number },
        shippingFee: { type: Number, default: 15, },
        tax: { type: Number, default: 0, },
        total: { type: Number },

        orderStatus: {
            type: String,
            enum: ["pending", "processing", "completed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;