const orderService = require("../services/oerder.services")

exports.createCODOrder = async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);
        const data = await orderService.createCODOrder(req);

        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ status: data.status, message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.createOrder = async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);
        const data = await orderService.createOrder(req);

        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ status: data.status, message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.getOrders = async (req, res) => {
    try {
        const data = await orderService.getOrders(req);

        if (data.status === "RecordNotFound") { return res.status(404).json({ message: result.message }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

        // return res.status(200).json({ message: data.message, data: data.data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const data = await orderService.getAllOrders(req);

        if (data.status === "RecordNotFound") { return res.status(404).json({ message: result.message }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const data = await orderService.getOrderById(req);

        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        console.error("controller- getOrderById", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.updateOrder = async (req, res) => {
    try {
        const data = await orderService.updateOrder(req);

        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        console.error("controller- update order", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const data = await orderService.deleteOrder(req);

        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        console.error("controller- delete order", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}