const productService = require("../services/products.services")

exports.getProducts = async (req, res) => {
    try {
        const data = await productService.getProducts(req);

        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const data = await productService.getProductById(req);

        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const data = await productService.createProduct(req);

        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}