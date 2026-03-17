const orderService = require("../services/oerder.services")

exports.createOrder = async (req, res) => {
    try {
        const data = await orderService.createOrder(req);

        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}