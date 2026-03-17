const Order = require("../models/order");

exports.createOrder = async (payload) => {
    try {
        return await Order.create(payload);
    } catch (error) {
        console.log("Error creating Oredr:", error);
        throw error;
    }
};