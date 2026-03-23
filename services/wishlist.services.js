const Wishlist = require("../models/wishlist");
const { findWishlistByUserId, creatWishlist, removeItem, addItem } = require("../repository/wishlist.repository");

exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user;
        const { productId } = req.body;

        let wishlist = await findWishlistByUserId(userId);

        if (!wishlist) {
            wishlist = await creatWishlist(userId,productId)
        } else {
            const exists = wishlist.items.find(
                (item) => Number(item.productId) === Number(productId)
            );

            if (!exists) {
                wishlist.items.push({ productId });
            }

            await wishlist.save();
        }

        return ({
            status: "Success",
            message: "Product added to wishlist",
            data: wishlist,
        });
    } catch (error) {
        console.error("Add to wishlist  error:", error);
        return {
            status: "Error", message: "Failed to Add Product"
        }
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user;

        const wishlist = await findWishlistByUserId(userId);

        if (!wishlist) {
            return {
                status: "Success",
                message: "Wishlist fetched successfully",
                data: {
                    items: []
                }
            };
        }

        return {
            status: "Success",
            message: "Wishlist fetched successfully",
            data: wishlist
        };

    } catch (error) {
        console.error("Get wishlist error:", error);
        return {
            status: "Error", message: "Failed to fetch wishlist"
        };
       
    }
};

exports.removeWishlistItem = async (req, res) => {
    try {
        const userId = req.user;
        const { productId } = req.params;

        let wishlist = await findWishlistByUserId(userId);

        if (!wishlist) {
            return {
                status: "RecordNotFound",
                message: "Wishlist not found",
            };
        }

        await Wishlist.updateOne(
            { userId },
            { $pull: { items: { productId: Number(productId) } } }
        );

        const updatedWishlist = await findWishlistByUserId(userId);

        return {
            status: "Success",
            message: "Product removed from wishlist",
            data: updatedWishlist,
        };

    } catch (error) {
        console.error("Remove wishlist item error:", error);
        return {
            status: "Error", message: "Failed to remove product from wishlist"
        };
       
    }
};

exports.toggleWishlist = async (req, res) => {
    try {
        const userId = req.user;
        console.log('userId: ', userId);
        const { productId } = req.body;

        let wishlist = await findWishlistByUserId(userId);

        // create wishlist if not exists
        if (!wishlist) {
            wishlist = await creatWishlist(userId,productId)
            return {
                status: "Success",
                message: "Product added to wishlist",
                data: wishlist
            };
        }

        const exists = wishlist.items.find(
            (item) => Number(item.productId) === Number(productId)
        );

        if (exists) {
            // remove product
            await removeItem(userId, productId)

            const updatedWishlist = await findWishlistByUserId(userId);

            return {
                status: "Success",
                message: "Product removed from wishlist",
                data: updatedWishlist
            };

        } else {
            // add product
            console.log("reach 1")
            await addItem(userId,productId);
            console.log("reach 2")

            const updatedWishlist = await findWishlistByUserId(userId);

            return {
                status: "Success",
                message: "Product added to wishlist",
                data: updatedWishlist
            };
        }

    } catch (error) {
        console.error("Toggle wishlist error:", error);
        return {
            status: "Error", message: "Failed to toggle wishlist"
        };
    }
};