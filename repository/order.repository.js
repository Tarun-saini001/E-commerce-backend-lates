const Order = require("../models/order");

exports.createOrder = async (payload) => {
    try {
        return await Order.create(payload);
    } catch (error) {
        console.log("Error creating Orders:", error);
        throw error;
    }
};


exports.findOrdersByUserId = async (userId) => {
    try {
         return await Order.find({ user: userId })
    } catch (error) {
         console.log("Error getting Orders:", error);
        throw error;
    }
};


exports.findOrderById  = async (orderId) => {
    try {
         return await Order.findById(orderId);
    } catch (error) {
         console.log("Error getting Order by id:", error);
        throw error;
    }
};

