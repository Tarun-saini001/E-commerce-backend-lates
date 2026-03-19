
const Product = require("../models/product");

exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;

        let filter = {};

        if (category) {
            filter.categoryName = {
                $regex: new RegExp(`^${category}$`, "i"),
            };
        }
        const products = await Product.find(filter);

        return {
            status: "Success",
            message: "Products fetched successfully!",
            data: products,
        };
    } catch (error) {
        return {
            status: "Error", message: "Error fetching product"
        };

    }
};


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return {
                status: "RecordNotFound",
                message: "Product not found"
            };
        }

        return {
            status: "Success",
            message: "Product fetched successfully",
            data: product,
        };
    } catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        console.log('product: ', product);

        return {
            status: "Success",
            message: "Product created successfully",
            data: product,
        };
    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
        });
    }
};