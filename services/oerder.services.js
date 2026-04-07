const cartModel = require("../models/cart");
const Order = require("../models/order");
const user = require("../models/user");
const orderRepository = require("../repository/order.repository");
const userRepository = require("../repository/user.repository")
const mongoose = require('mongoose');

// exports.createOrder = async (req) => {
//     console.log('req.body: ', req.body);
//     const userId = req.user.id;
//     const body = req.body;


//     const userData = await userRepository.findUserById(userId);
//     console.log('userData: ', userData);

//     if (!userData) {
//         return {
//             status: "RecordNotFound",
//             message: "User not found",
//         };
//     }
//     // get user cart
//     const cart = await cartModel.findOne({ user: userId });

//     if (!cart || cart.items.length === 0) {
//         return {
//             status: "RecordNotFound",
//             message: "Cart is empty",
//         };
//     }

//     // calculate totals
//     const subtotal = cart.subtotal;
//     const shippingFee = 15;
//     const tax = subtotal * 0.05;
//     const total = subtotal + shippingFee + tax;


//     const orderPayload = {
//         user: userId,

//         billingDetails: {
//             name: userData.name,
//             country: body.billingDetails.country,
//             city: body.billingDetails.city,
//             district: body.billingDetails.district,
//             postalCode: body.billingDetails.postalCode,
//             address: body.billingDetails.address,
//             phone: body.billingDetails.phone,
//             email: userData.email,
//         },

//         items: cart.items,

//         shippingMethod: body.shippingMethod,

//         subtotal,
//         shippingFee,
//         tax,
//         total,
//         orderStatus: body.orderStatus
//     };


//     const order = await orderRepository.createOrder(orderPayload);
//     console.log('order: (create) ', order);

//     const populatedOrder = await order.populate("items.productId");

//     const transformedItems = populatedOrder.items.map((item) => ({
//         _id: item.productId._id,
//         title: item.productId.title,
//         price: item.productId.price,
//         thumbnail: item.productId.thumbnail,
//         brand: item.productId.brand,
//         category: item.productId.category,
//         quantity: item.quantity,
//     }));

//     // clear cart after order
//     await cartModel.findOneAndUpdate(
//         { user: userId },
//         { items: [], subtotal: 0 }
//     );


//     return {
//         status: "Success",
//         message: "Order placed successfully",
//         data: {
//             ...populatedOrder.toObject(),
//             items: transformedItems
//         }
//     };
// };

exports.createOrder = async (req) => {
    try {
        console.log('req.body: ', req.body);
        const userId = req.user.id;
        const body = req.body;


        const userData = await userRepository.findUserById(userId);
        console.log('userData: ', userData);

        if (!userData) {
            return {
                status: "RecordNotFound",
                message: "User not found",
            };
        }

        const cart = await cartModel.findOne({ user: userId });
        console.log('cart: fetch cart data in create order', cart);

        if (!cart || cart.items.length === 0) {
            return {
                status: "RecordNotFound",
                message: "Cart is empty",
            };
        }



        const populatedCartItems = await cart.populate("items.productId");


        let subtotal = populatedCartItems.items.reduce((acc, item) => {
            const price = item.productId?.price || 0;
            return acc + price * item.quantity;
        }, 0);

        let shippingFee = 15;
        let tax = subtotal * 0.05;
        let total = subtotal + shippingFee + tax;

        subtotal = subtotal.toFixed(2);
        tax = tax.toFixed(2);
        total = total.toFixed(2);

        const transformedItems = populatedCartItems.items.map((item) => ({
            _id: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            thumbnail: item.productId.thumbnail,
            brand: item.productId.brand,
            category: item.productId.category,
            quantity: item.quantity,
        }));
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

            items: transformedItems,

            shippingMethod: body.shippingMethod,

            subtotal,
            shippingFee,
            tax,
            total,
            orderStatus: body.orderStatus
        };


        console.log('orderPayload: ', orderPayload);
        const order = await orderRepository.createOrder(orderPayload);
        console.log('order: (create) ', order);


        // clear cart after order
        await cartModel.findOneAndUpdate(
            { user: userId },
            { items: [], subtotal: 0 }
        );


        return {
            status: "Success",
            message: "Order placed successfully",
            data: order
        };
    } catch (error) {
        console.log('error creating order ', error);
        return {
            status: "Error", message: "Error creating product"
        };
    }
};

exports.getOrders = async (req) => {
    try {
        const userId = req.user.id;

        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (currentPage - 1) * limit;

        const userData = await userRepository.findUserById(userId);
        if (!userData) {
            return {
                status: "RecordNotFound",
                message: "User not found",
            };
        }


        const orders = await orderRepository
            .findOrdersByUserId(userId, skip, limit)

        console.log('orders: ', orders);
        const totalOrders = await Order.countDocuments();

        const totalPages = Math.ceil(totalOrders / limit);

        // const transformedOrders = orders.map((order) => ({
        //     ...order.toObject(),
        //     items: order.items.map((item) => ({
        //         _id: item.productId._id,
        //         title: item.productId.title,
        //         price: item.productId.price,
        //         thumbnail: item.productId.thumbnail,
        //         brand: item.productId.brand,
        //         category: item.productId.category,
        //         quantity: item.quantity,
        //     })),
        // }));

        return {
            status: "Success",
            message: "Orders fetched successfully",
            data: {
                orders,
                currentPage,
                totalPages,
                totalOrders
            },
        };
    } catch (error) {
        console.log('error while getting orders ', error);
        return {
            status: "Error", message: "Error while getting orders"
        };
    }
};


exports.getAllOrders = async (req) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (currentPage - 1) * limit;


        const orders = await orderRepository
            .getAllOrders(skip, limit)

        console.log('all orders: ', orders);
        const totalOrders = await Order.countDocuments();

        const totalPages = Math.ceil(totalOrders / limit);

        return {
            status: "Success",
            message: "Orders fetched successfully",
            data: {
                orders,
                currentPage,
                totalPages,
                totalOrders
            },
        };
    } catch (error) {
        console.log('error while getting all orders ', error);
        return {
            status: "Error", message: "Error while getting all orders"
        };
    }
};


exports.getOrderById = async (req) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return {
                status: "Validation",
                message: "Invalid order ID",
            };
        }

        const order = await orderRepository.findOrderById(orderId)

        if (!order || order.user.toString() !== userId.toString()) {
            return {
                status: "RecordNotFound",
                message: "Order not found",
            };
        }
        // const transformedOrder = {
        //     ...order.toObject(),
        //     items: order.items.map((item) => ({
        //         _id: item.productId._id,
        //         title: item.productId.title,
        //         price: item.productId.price,
        //         thumbnail: item.productId.thumbnail,
        //         brand: item.productId.brand,
        //         category: item.productId.category,
        //         quantity: item.quantity,
        //     })),
        // };
        return {
            status: "Success",
            message: "Order fetched successfully",
            data: order,
        };
    } catch (error) {
        console.log('error while getting order by Id ', error);
        return {
            status: "Error", message: "Error while getting order by Id"
        };
    }
};

exports.updateOrder = async (req) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;
        const body = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return {
                status: "Validation",
                message: "Invalid order ID",
            };
        }

        const order = await orderRepository.findOrderById(orderId);

        if (!order || order.user.toString() !== userId.toString()) {
            return {
                status: "RecordNotFound",
                message: "Order not found",
            };
        }


        const updatedData = {
            shippingMethod: body.shippingMethod || order.shippingMethod,
            orderStatus: body.orderStatus || order.orderStatus,
            billingDetails: {
                ...order.billingDetails,
                ...body.billingDetails,
            },
        };

        const updatedOrder = await orderRepository.updateOrder(orderId, updatedData);

        return {
            status: "Success",
            message: "Order updated successfully",
            data: updatedOrder,
        };
    } catch (error) {
        console.log("error updating order", error);
        return {
            status: "Error",
            message: "Error updating order",
        };
    }
};

exports.deleteOrder = async (req) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return {
                status: "Validation",
                message: "Invalid order ID",
            };
        }

        const order = await orderRepository.findOrderById(orderId);

        if (!order || order.user.toString() !== userId.toString()) {
            return {
                status: "RecordNotFound",
                message: "Order not found",
            };
        }

        await orderRepository.deleteOrder(orderId);

        return {
            status: "Success",
            message: "Order deleted successfully",
        };
    } catch (error) {
        console.log("error deleting order", error);
        return {
            status: "Error",
            message: "Error deleting order",
        };
    }
}; 