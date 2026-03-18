const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: Number, // from dummy API
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);