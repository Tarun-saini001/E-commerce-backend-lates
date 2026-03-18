
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


exports.addCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return {
        status: "Validation",
        message: "Category name is required",
      };
    }

    name = name.trim();

    const existing = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existing) {
      return {
        status: "Validation",
        message: "Category already exists",
      };
    }

    const category = await Category.create({ name });

    return{
      status: "Success",
      message: "Category created successfully",
      data: category,
    };
  } catch (error) {
    console.log("error:(addCategory) ", error);

    return{
      status: "Error",
      message: "Failed to create category",
    };
  }
};