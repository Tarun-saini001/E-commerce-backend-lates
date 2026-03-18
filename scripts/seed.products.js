const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");

const seedProducts = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/e-commerce");

    await Product.deleteMany();

    // dummy products
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();

    // get categories
    const categories = await Category.find();


    const categoryMap = {};

    categories.forEach((cat) => {
      categoryMap[cat.name.toLowerCase()] = cat;
    });

    // map products
    const productsWithCategory = data.products.map((p) => {
      const matchedCategory = categoryMap[p.category];

      return {
        ...p,
        category: matchedCategory?._id,
        categoryName: matchedCategory?.name,
      };
    });

    
    await Product.insertMany(productsWithCategory);

    console.log("Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();