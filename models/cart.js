const mongoose = require("mongoose")

const cartItemSchema = new mongoose.Schema(
    {
        productId: { type: Number, required: true, },
        title: { type: String, required: true, },
        price: { type: Number, required: true, },
        thumbnail: { type: String, },
        brand: { type: String, },
        category: { type: String, },
        quantity: { type: Number, default: 1, min: 1, },
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true, },
        items: [cartItemSchema],
        subtotal: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const cart = mongoose.model("cart", cartSchema);
module.exports = cart
