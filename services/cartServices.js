const verifyToken = require("../middlewares/verifyToken");
const cart = require("../models/cart");
const router = require("express").Router();


exports.addToCart= async (req, res) => {
    try {
        console.log('req.user: ', req.user);
        const userId = req.user;

        const {
            productId,
            title,
            price,
            thumbnail,
            brand,
            category,
            quantity = 1
        } = req.body;

        if (!productId || !title || !price) {
            return res.status(400).json({
                message: "Product data missing",
            });
        }

        let cartData = await cart.findOne({ user: userId });
        // create cart if not exist
        if (!cartData) {
            cartData = new cart({
                user: userId,
                items: [],
            });
        }

        const existingItem = cartData.items.find(
            (item) => item.productId === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartData.items.push({
                productId,
                title,
                price,
                thumbnail,
                brand,
                category,
                quantity,
            });
        }

        // recalculate subtotal
        cartData.subtotal = cartData.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
        await cartData.save();
        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: cartData,
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}