
const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return{
      status: "Success",
      message:"Products fetched successfully!",
      data: products,
    };
  } catch (error) {
        res.status(500).json({ message: "Error fetching product" });

  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return{
        status:"RecordNotFound",
         message: "Product not found" };
    }

    return{
      status: "Success",
      message:"Product fetched successfully",
      data: product,
    };
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};