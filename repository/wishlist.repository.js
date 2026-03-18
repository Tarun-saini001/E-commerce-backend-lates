const Wishlist = require("../models/wishlist");

exports.findWishlistByUserId = async (userId) => {

    return await Wishlist.findOne({ userId:userId }).catch((error) => {
        console.log("Error fetching Wishlist by user id:", error);
        throw error;
    })
};

exports.creatWishlist = async (userId,productId) => {
    try {
        return await Wishlist.create({
            userId,
            items: [{ productId: Number(productId) }]
        });
    } catch (error) {
        console.log("Error creating wishlist:", error);
        throw error;
    }

}


exports.removeItem = async (userId, productId) => {
    try {
        await Wishlist.updateOne(
            { userId },
            { $pull: { items: { productId: Number(productId) } } }
        );
    } catch (error) {
        console.log("Error remove item from wishlist:", error);
        throw error;
    }
}

exports.addItem = async (userId, productId) => {
    try {
        await Wishlist.updateOne(
            { userId },
            { $addToSet: { items: { productId: Number(productId) } } }
        );
    } catch (error) {
        console.log("Error add item to wishlist:", error);
        throw error;
    }
}