const verifyToken = require("../middlewares/verifyToken");
const cart = require("../models/cart");
const cartRepo = require("../repository/cart.repository")

exports.addToCart = async (req) => {
    try {
        console.log('req.user: ', req.user);
        const userId = req.user;

        const {
            id,
            title,
            price,
            thumbnail,
            brand,
            category,
            quantity = 1
        } = req.body;

        if (!id || !title || !price) {
            return {
                status: "RecordNotFound",
                message: "Product data missing",
            }

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
            (item) => Number(item.id) === Number(id)
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartData.items.push({
                id: Number(id),
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

        return {
            status: "Success",
            message: "Product added to cart",
            data: cartData,
        };
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            message: "Server error",
        });
    }
}

exports.getCart = async (req) => {
    try {
        const id = req.user;
        const cartData = await cartRepo.findCartByUserId(id)
        console.log('cartData: ', cartData);

        if (!cartData) {
            return {
                status: "Success",
                message: "Your cart is empty",
                data: {
                    items: [],
                    subtotal: 0,
                },
            }

        }

        return {
            status: "Success",
            messsage: "Cart fetched successfully",
            data: cartData,
        };

    } catch (error) {
        console.error("get cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
        });
    }
}

exports.updateCart = async (req) => {
    try {
        const id = req.user
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return {
                status: "Validation",
                message: "Quantity must be at least 1"
            }
        }

        let cartData = await cartRepo.findCartByUserId(id);
        console.log("cart data before update:", cartData);

        if (!cartData) {
            return {
                status: "RecordNotFound",
                message: "Cart not found"
            }
        }
        console.log('productId: ', productId);
        const itemIndex = cartData.items.findIndex(
            (item) => item.id.toString() === productId.toString()
        )
        if (itemIndex === -1) {
            return {
                status: "RecordNotFound",
                message: "Product not found in cart"
            }
        }

        //update quantity
        cartData.items[itemIndex].quantity = quantity;

        // recalculate total
        cartData.subtotal = cartData.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        )

        await cartData.save();
        console.log("cart data after update:", cartData);
        return {
            status:"Success",
            data: cartData,
            message: "Cart update successfully"
        }
    } catch (error) {
        console.error("update cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update the cart",
        });
    }
}


exports.removeItem = async (req) => {
    try {
        const id = req.user;
        const { productId } = req.params;
        let cartData = await cartRepo.findCartByUserId(id);

        if (!cartData) {
            return {
                status: "RecordNotFound",
                message: "Cart not found"
            }
        }
        console.log('productId: ', productId);

        const newCartItems = cartData.items.filter(
            (item) => item.id.toString() !== productId.toString()
        )

        if (newCartItems.length === cartData.items.length) {
            return {
                status: "RecordNotFound",
                message: "Product not found in cart"
            }
        }
        // upadte cart items 
        cartData.items = newCartItems;
        // recalculate subtotal
        cartData.subtotal = cartData.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        );
        await cartData.save();

        return {
            status:"Success",
            data: cartData,
            message: "Product removed from cart successfully",
        };
    } catch (error) {
        console.error("removeItem cart error:", error);
        res.status(500).json({
            message: "Failed to remove item from the cart",
        });
    }
}


exports.clearCart = async (req) => {
    try {
        const id = req.user;
        let cartData = await cartRepo.findCartByUserId(id);

        if (!cartData) {
            return {
                status: "RecordNotFound",
                message: "Cart not found"
            }
        }

        // clear items and  subtotal
        cartData.items = [];
        cartData.subtotal = 0;

        await cartData.save();

        return {
            status:"Success",
            message: "Cart cleared successfully",
            data: cartData,
        };
    } catch (error) {
        console.error("clear cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to clear the cart",
        });
    }
}