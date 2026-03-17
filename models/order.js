const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        thumbnail: { type: String },
        brand: { type: String },
        category: { type: String },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const billingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        postalCode: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
    },
    { _id: false }
);


const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, },

        billingDetails: billingSchema,

        items: [orderItemSchema],

        shippingMethod: { type: String, enum: ["upi", "cod"], default: "cod", },
        subtotal: { type: Number, required: true, },
        shippingFee: { type: Number, default: 15, },
        tax: { type: Number, default: 0, },
        total: { type: Number, required: true, },

        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;