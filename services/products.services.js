
const { default: mongoose } = require("mongoose");
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
        console.log('error: get products service error ', error.message);
        return {
            status: "Error", message: "Error fetching product"
        };

    }
};


exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
                status: "Validation",
                message: "Invalid ID format"
            };
        }
        const product = await Product.findById(id);



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
        console.log('error: ', error.message);
        return {
            status: "Error", message: "Error fetching product by id"
        };
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