
const Category = require("../models/category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return {
      status: "Success",
      message: "Categories fetched successfully",
      data: categories,
    };
  } catch (error) {
    console.log('error:(getCategories) ', error);
    return {
      status: "Error",
      message: "Failed to fetch categories"
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
    console.log('req.file: ', req.file);

    if (!req.file) {
      return {
        status: "Validation",
        message: "Category image is required",
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

    const imagePath = `/uploads/categories/${req.file.filename}`;

    const category = await Category.create({
      name,
      image: imagePath,
    });

    return {
      status: "Success",
      message: "Category created successfully",
      data: category,
    };
  } catch (error) {
    console.log("error:(addCategory) ", error);

    return {
      status: "Error",
      message: "Failed to create category",
    };
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return { 
        status:"RecordNotFound",
        message: "Category ID is required" };
    }
    const category = await Category.findById(id);

    if (!category) {
      return {
        status: "RecordNotFound",
        message: "Category not found",
      };
    }

    await Category.findByIdAndDelete(id);

    return {
      status:"Success",
      message: "Category deleted successfully",
    };
  } catch (error) {
    console.error("Delete Category Error:", error);
    return {
      status: "Error",
      message: "Failed to delete the category",
    };
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return {
        status: "RecordNotFound",
        message: "Category not found",
      };
    }

    let imagePath = category.image;

    if (req.file) {
      imagePath = `/uploads/categories/${req.file.filename}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name || category.name,
        image: imagePath,
      },
      { new: true }
    );

    return {
      status: "Success",
      message: "Category updated successfully",
      data: updatedCategory,
    };
  } catch (error) {
    console.error("Update Category Error:", error);

    return {
      status: "Error",
      message: "Failed to update the category",
    };
  }
};