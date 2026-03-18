
const Category = require("../models/category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return{
      status: "Success",
      message:"Categories fetched successfully",
      data: categories,
    };
  } catch (error) {
    console.log('error:(getCategories) ', error);
    return{
        status:"Error",
        message:"Failed to fetch categories"
    }
  }
};