const cart = require("../models/cart");

exports.findCartByUserId = async (id) => {
    try {
        return await cart.findById(id);
    } catch (error) {
        console.log("Error fetching cart by user id:", error);
        throw error;
    }
};