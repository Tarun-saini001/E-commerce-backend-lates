const cartServices = require("../services/cartServices");

exports.addToCart = async (req, res) => {
    try {
        const data = await cartServices.addToCart(req);

        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const data = await cartServices.getCart(req);

        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.updateCart = async (req, res) => {
    try {
        const data = await cartServices.updateCart(req);

        if (data.status == "Validation") { res.status(400).json({ message: data.message }) }
        if (data.status == "RecordNotFound") { return res.status(404).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}


exports.removeItem = async (req, res) => {
    try {
        const data = await cartServices.removeItem(req);

        if (data.status == "RecordNotFound") { return res.status(404).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.clearCart = async (req, res) => {
    try {
        const data = await cartServices.clearCart(req);

        if (data.status == "RecordNotFound") { return res.status(404).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}