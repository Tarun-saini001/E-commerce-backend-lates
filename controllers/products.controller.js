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
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.createProduct = async (req, res) => {
    try {
        console.log("react 1");
        const data = await productService.createProduct(req);
        console.log('data: ', data);
        console.log("react 2");

        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const data = await productService.updateProduct(req);

        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}


exports.deleteProduct = async (req, res) => {
    try {
        const data = await productService.deleteProduct(req);

        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.getDashboardStats = async (req, res) => {
    try {
        console.log("aagya");
        const data = await productService.getDashboardStats(req);
        console.log("yaha b aagya");
        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}