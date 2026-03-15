const Wishlist = require("../models/wishlist");

exports.findWishlistByUserId = async (userId) => {
    
        return await Wishlist.findOne({userId}).catch ((error)=>{
        console.log("Error fetching Wishlist by user id:", error);
        throw error;
    })
};

exports.findWishlistItem = async ()=>{
    
}