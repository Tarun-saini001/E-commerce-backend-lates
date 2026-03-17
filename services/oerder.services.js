const cartModel = require("../models/cart");
const user = require("../models/user");
const orderRepository = require("../repository/order.repository");
const userRepository = require("../repository/user.repository")
const mongoose = require('mongoose');

exports.createOrder = async (req) => {
    console.log('req.body: ', req.body);
    const userId = req.user; 
    const body = req.body;


    const userData = await userRepository.findUserById(userId);
    console.log('userData: ', userData);

    if (!userData) {
        return {
            status: "RecordNotFound",
            message: "User not found",
        };
    }
    // get user cart
    const cart = await cartModel.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
        return {
            status: "RecordNotFound",
            message: "Cart is empty",
        };
    }

    // calculate totals
    const subtotal = cart.subtotal;
    const shippingFee = 15;
    const tax = subtotal * 0.05;
    const total = subtotal + shippingFee + tax;


    const orderPayload = {
        user: userId,

        billingDetails: {
            name: userData.name,
            country: body.billingDetails.country,
            city: body.billingDetails.city,
            district: body.billingDetails.district,
            postalCode: body.billingDetails.postalCode,
            address: body.billingDetails.address,
            phone: body.billingDetails.phone,
            email: userData.email,
        },

        items: cart.items,

        shippingMethod: body.shippingMethod,

        subtotal,
        shippingFee,
        tax,
        total,
        orderStatus:body.orderStatus
    };


    const order = await orderRepository.createOrder(orderPayload);

    // clear cart after order
    await cartModel.findOneAndUpdate(
        { user: userId },
        { items: [], subtotal: 0 }
    );

    return {
        status: "Success",
        message: "Order placed successfully",
        data: order,
    };
};