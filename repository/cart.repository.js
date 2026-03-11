const cart = require("../models/cart");

exports.findCartByUserId = async (userId) => {
    
        return await cart.findOne({user:userId}).catch ((error)=>{
        console.log("Error fetching cart by user id:", error);
        throw error;
    })
};