const cartServices = require("../services/cartServices");

exports.addToCart = async (req, res) => {
    try {
        const data = await cartServices.addToCart(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};