const Wishlist = require("../models/wishlist");
const { findWishlistByUserId } = require("../repository/wishlist.repository");

exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user;
        const { productId } = req.body;

        let wishlist = await findWishlistByUserId(userId);

        if (!wishlist) {
            wishlist = await Wishlist.create({
                userId,
                items: [{ productId }],
            });
        } else {
            const exists = wishlist.items.find(
                (item) => Number(item.productId) === Number(productId)
            );

            if (!exists) {
                wishlist.items.push({ productId });
            }

            await wishlist.save();
        }

        return({
            status: "Success",
            message: "Product added to wishlist",
            data: wishlist,
        });
    } catch (error) {
         console.error("Add to wishlist  error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to Add Product",
        });
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
        res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist",
        });
    }
};