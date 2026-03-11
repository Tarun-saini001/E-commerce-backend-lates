const cartServices = require("../services/cartServices");

exports.addToCart = async (req, res) => {
    try {
        const data = await cartServices.addToCart(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.getCart= async (req,res) => {
    try {
        const data = await cartServices.getCart(req,res);
         res.status(200).json(data)
    } catch (error) {
         res.status(error.status || 500).json ({message:error.message});
    }
}

exports.updateCart= async (req,res) => {
    try {
        const data = await cartServices.updateCart(req,res);
         res.status(200).json(data)
    } catch (error) {
         res.status(error.status || 500).json ({message:error.message});
    }
}


exports.removeItem= async (req,res) => {
    try {
        const data = await cartServices.removeItem(req,res);
         res.status(200).json(data)
    } catch (error) {
         res.status(error.status || 500).json ({message:error.message});
    }
}

exports.clearCart= async (req,res) => {
    try {
        const data = await cartServices.clearCart(req,res);
         res.status(200).json(data)
    } catch (error) {
         res.status(error.status || 500).json ({message:error.message});
    }
}