const mongoose = require("mongoose");
const Wishlist = require("../models/wishlist");
const { findWishlistByUserId, creatWishlist, removeItem, addItem } = require("../repository/wishlist.repository");

exports.addToWishlist = async (req) => {
    try {
        const userId = req.user;
        const { productId } = req.body;

        let wishlist = await findWishlistByUserId(userId);

        if (!wishlist) {
            wishlist = await creatWishlist(userId, productId)
        } else {
            const exists = wishlist.items.find(
                (item) => item.productId.toString() === productId.toString()
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


        const populatedWishlist = await wishlist.populate("items.productId");

        const transformedItems = populatedWishlist.items.map((item) => ({
            _id: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            thumbnail: item.productId.thumbnail,
            brand: item.productId.brand,
            category: item.productId.category,
            categoryName: item.productId.categoryName,
        }));

        return {
            status: "Success",
            message: "Wishlist fetched successfully",
            data: {
                items: transformedItems
            }
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
            { $pull: { items: { productId: productId } } }
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

// exports.toggleWishlist = async (req, res) => {
//     try {
//         const userId = req.user;
//         console.log('userId: ', userId);
//         const { productId } = req.body;

//          if (!productId) {
//             return {
//                 status: "Validation",
//                 message: "ProductId is required"
//             };
//         }

//         let wishlist = await findWishlistByUserId(userId);

//         // create wishlist if not exists
//         if (!wishlist) {
//             wishlist = await creatWishlist(userId,productId)
//             return {
//                 status: "Success",
//                 message: "Product added to wishlist",
//                 data: wishlist
//             };
//         }

//         const exists = wishlist.items.find(
//             (item) => item.productId.toString() === productId.toString()
//         );

//         if (exists) {
//             // remove product
//             await removeItem(userId, productId)

//             const updatedWishlist = await findWishlistByUserId(userId);
//             console.log('updatedWishlist: ', updatedWishlist);

//             return {
//                 status: "Success",
//                 message: "Product removed from wishlist",
//                 data: updatedWishlist
//             };

//         } else {
//             // add product
//             console.log("reach 1")
//             await addItem(userId,productId);
//             console.log("reach 2")

//             const updatedWishlist = await findWishlistByUserId(userId);

//             return {
//                 status: "Success",
//                 message: "Product added to wishlist",
//                 data: updatedWishlist
//             };
//         }

//     } catch (error) {
//         console.error("Toggle wishlist error:", error);
//         return {
//             status: "Error", message: "Failed to toggle wishlist"
//         };
//     }
// };

exports.toggleWishlist = async (req) => {
    try {
        const userId = req.user;
        const { productId } = req.body;


        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return {
                status: "Validation",
                message: "Valid productId required"
            };
        }

        let wishlist = await findWishlistByUserId(userId);


        if (!wishlist) {
            wishlist = await creatWishlist(userId, productId);
        } else {
            const exists = wishlist.items.find(
                (item) => item.productId.toString() === productId.toString()
            );

            if (exists) {
                wishlist.items = wishlist.items.filter(
                    (item) => item.productId.toString() !== productId.toString()
                );
            } else {
                wishlist.items.push({ productId });
            }

            await wishlist.save();
        }


        const populatedWishlist = await wishlist.populate("items.productId");


        const transformedItems = populatedWishlist.items.map((item) => ({
            _id: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            thumbnail: item.productId.thumbnail,
            brand: item.productId.brand,
            category: item.productId.category,
            categoryName: item.productId.categoryName,
        }));

        return {
            status: "Success",
            message: "Wishlist toggled successfully",
            data: {
                items: transformedItems
            }
        };

    } catch (error) {
        console.error("Toggle wishlist error:", error);
        return {
            status: "Error",
            message: "Failed to toggle wishlist"
        };
    }
};