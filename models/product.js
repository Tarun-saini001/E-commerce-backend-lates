const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        id: { type: Number }, // from dummy API
        title: { type: String },
        description: { type: String },
        price: { type: Number },
        discountPercentage: { type: Number },
        rating: { type: Number },
        stock: { type: Number },
        brand: { type: String },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        categoryName: { type: String },
        thumbnail: { type: String },
        images: [String],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);