const mongoose = require("mongoose")

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

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
