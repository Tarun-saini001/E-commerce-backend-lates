const { default: mongoose } = require("mongoose");
const verifyToken = require("../middlewares/verifyToken");
const cart = require("../models/cart");
const cartRepo = require("../repository/cart.repository")

exports.addToCart = async (req) => {
    try {
        console.log('req.user: ', req.user);
        const userId = req.user;

        // const {
        //     _id,
        //     title,
        //     price,
        //     thumbnail,
        //     brand,
        //     category,
        //     categoryName,
        //     quantity = 1
        // } = req.body;

        const { productId, quantity = 1 } = req.body;
        console.log('req.body: ', req.body);

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return {
                status: "Validation",
                message: "Valid Product ID is required",
            };
        }

        // console.log('categoryName,: ', categoryName);
        // if (!_id || !title || !price) {
        //     return {
        //         status: "RecordNotFound",
        //         message: "Product data missing",
        //     }

        // }

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
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartData.items.push({
                productId,
                quantity,
            });
        }

        // recalculate subtotal
        // cartData.subtotal = cartData.items.reduce(
        //     (total, item) => total + item.price * item.quantity,
        //     0
        // );
        await cartData.save();
        console.log('cartData: after save', cartData);


        const populatedCart = await cart.findById(cartData._id)
            .populate("items.productId");

        const transformedItems = populatedCart.items.map((item) => {
            const p = item.productId;
            if (!p) return null;
            return {
                _id: p._id,
                title: p.title,
                price: p.price,
                thumbnail: p.thumbnail,
                brand: p.brand,
                category: p.category,
                categoryName: p.categoryName,
                quantity: item.quantity,
            };
        });

        const subtotal = transformedItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        return {
            status: "Success",
            message: "Product added to cart",
            data: {
                items: transformedItems,
                subtotal,
            },
        };
    } catch (error) {
        console.error("Add to cart error:", error);
        return {
            status: "Error", message: "Error Add to cart"
        };

    }
}

exports.getCart = async (req) => {
    try {
        const id = req.user;

        const cartData = await cart.findOne({ user: id })
            .populate("items.productId");

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


        const transformedItems = cartData.items.map((item) => {
            const product = item.productId;

            return {
                _id: product._id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                brand: product.brand,
                category: product.category,
                categoryName: product.categoryName,
                quantity: item.quantity,
            };
        });

        const subtotal = transformedItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        return {
            status: "Success",
            data: {
                items: transformedItems,
                subtotal,
            },
        };

    } catch (error) {
        console.error("get cart error:", error);
        return {
            status: "Error", message: "Failed to fetch cart"
        };

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
            (item) => item.productId.toString() === productId.toString()
        );
        if (itemIndex === -1) {
            return {
                status: "RecordNotFound",
                message: "Product not found in cart"
            }
        }

        //update quantity
        cartData.items[itemIndex].quantity = quantity;

        // recalculate total
        // cartData.subtotal = cartData.items.reduce(
        //     (acc, item) => acc + item.price * item.quantity, 0
        // )



        await cartData.save();

        const populatedCart = await cartData.populate("items.productId");

        cartData.subtotal = populatedCart.items.reduce(
            (acc, item) => acc + item.productId.price * item.quantity,
            0
        );

        await cartData.save();

        const transformedItems = populatedCart.items.map((item) => ({
            _id: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            thumbnail: item.productId.thumbnail,
            brand: item.productId.brand,
            category: item.productId.category,
            categoryName: item.productId.categoryName,
            quantity: item.quantity,
        }));

        return {
            status: "Success",
            data: {
                items: transformedItems,
                subtotal: cartData.subtotal,
            },
        };
    } catch (error) {
        console.error("update cart error:", error);
        return {
            status: "Error", message: "Failed to update the cart"
        };

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
            (item) => item.productId.toString() !== productId.toString()
        );

        if (newCartItems.length === cartData.items.length) {
            return {
                status: "RecordNotFound",
                message: "Product not found in cart"
            }
        }
        // upadte cart items 
        cartData.items = newCartItems;
        const populatedCart = await cartData.populate("items.productId");

        cartData.subtotal = populatedCart.items.reduce(
            (acc, item) => acc + item.productId.price * item.quantity,
            0
        );

        await cartData.save();

        const transformedItems = populatedCart.items.map((item) => ({
            _id: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            thumbnail: item.productId.thumbnail,
            brand: item.productId.brand,
            category: item.productId.category,
            categoryName: item.productId.categoryName,
            quantity: item.quantity,
        }));

        return {
            status: "Success",
            data: {
                items: transformedItems,
                subtotal: cartData.subtotal,
            },
        };

    } catch (error) {
        console.error("clear cart error:", error);
        return {
            status: "Error", message: "Failed to clear the cart"
        };
    }
}