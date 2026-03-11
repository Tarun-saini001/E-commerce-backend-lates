const verifyToken = require("../middlewares/verifyToken");
const cart = require("../models/cart");
const router = require("express").Router();
const cartRepo = require("../repository/cart.repository")

exports.addToCart = async (req, res) => {
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

        let cartData = await cartRepo.findCartByUserId(userId);
        console.log('cartData: ', cartData);
        // create cart if not exist
        if (!cartData) {
            cartData = await cart.create({
                user: userId,
                items: [],
            });
        }

        const existingItem = cartData.items.find(
            (item) => item.productId === Number(productId)
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
            message: "Product added to cart",
            data: cartData,
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
}

exports.getCart = async (req, res) => {
    try {
        const id = req.user;
        const cartData = await cartRepo.findCartByUserId(id)

        if (!cartData) {
            return res.status(200).json({
                data: {
                    items: [],
                    subtotal: 0,
                },
            });
        }

        res.status(200).json({
            data: cartData,
        });

    } catch (error) {
        console.error("get cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
        });
    }
}

exports.updateCart = async (req, res) => {
    try {
        const id = req.user
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1", });
        }

        let cartData = await cartRepo.findCartByUserId(id);
        console.log("cart data before update:", cartData);

        if (!cartData) {
            return res.status(400).json({ message: "Cart not found" });
        }
        console.log('productId: ', productId);
        const itemIndex = cartData.items.findIndex(
            (item) => item.productId.toString() === productId.toString()
        )
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" })
        }

        //update quantity
        cartData.items[itemIndex].quantity = quantity;

        // recalculate total
        cartData.subtotal = cartData.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        )

        await cartData.save();
        console.log("cart data after update:", cartData);

        res.status(200).json({ data: cartData, messsage: "Cart update successfully" })
    } catch (error) {
        console.error("update cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update the cart",
        });
    }
}


exports.removeItem = async (req, res) => {
    try {
        const id = req.user;
        const { productId } = req.params;
        let cartData = await cartRepo.findCartByUserId(id);
        console.log("cart data before update:", cartData);

        if (!cartData) {
            return res.status(400).json({ message: "Cart not found" });
        }
        console.log('productId: ', productId);

        const newCartItems = cartData.items.filter(
            (item) => item.productId.toString() !== productId.toString()
        )

        if (newCartItems.length === cartData.items.length) {
            return res.status(404).json({ message: "Product not forund in cart" })
        }
        // upadte cart items 
        cartData.items = newCartItems;
        // recalculate subtotal
        cartData.subtotal = cartData.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        );
        await cartData.save();

        return res.status(200).json({
            data: cart, message: "Product removed from cart successfully",
        });
    } catch (error) {
        console.error("removeItem cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove item from the cart",
        });
    }
}


exports.clearCart = async (req,res) => {
    try {
        
    } catch (error) {
        console.error("clear cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to clear the cart",
        });
    }
}