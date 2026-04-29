const Order = require("../models/order");

exports.createOrder = async (payload) => {
    console.log('payload: ', payload);
    try {
        return await Order.create(payload);
    } catch (error) {
        console.log("Error creating Orders:", error);
        throw error;
    }
};


exports.findOrdersByUserId = async (userId, skip, limit) => {
    try {
        return await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
    } catch (error) {
        console.log("Error getting Orders:", error);
        throw error;
    }
};


exports.findOrderById = async (orderId) => {
    try {
        return await Order.findById(orderId);
    } catch (error) {
        console.log("Error getting Order by id:", error);
        throw error;
    }
};


exports.updateOrder = async (orderId, updatedData) => {
    try {
        return await Order.findByIdAndUpdate(
            orderId,
            { $set: updatedData },
            { new: true }
        );
    } catch (error) {
        console.log("Error updating Order by id:", error);
        throw error;
    }
}

exports.deleteOrder = async (orderId, updatedData) => {
    try {
        return await Order.findByIdAndDelete(orderId,);
    } catch (error) {
        console.log("Error deleting Order by id:", error);
        throw error;
    }
}

exports.getAllOrders = async ( skip, limit) => {
    try {
        return await Order.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
    } catch (error) {
        console.log("Error getting all Orders:", error);
        throw error;
    }
};