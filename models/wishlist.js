const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
}
);

const wishlistSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true, },
        items: [wishlistItemSchema],
    },
    { timestamps: true }
);

const Wishlist = mongoose.model("wishlist", wishlistSchema);

module.exports = Wishlist;