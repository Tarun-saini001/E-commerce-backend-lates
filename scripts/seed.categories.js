const mongoose = require("mongoose");
const Category = require("../models/category");

const categories = [
  "Beauty",
  "Fragrances",
  "Furniture",
  "Groceries",
  "Home Decoration",
  "kitchen Accessories",
  "Laptops",
  "Mens Shirts",
  "Mens Shoes",
  "Smartphones",
  "Womens Dresses",
];

const seedCategories = async () => {
  await mongoose.connect("mongodb://localhost:27017/e-commerce");

  await Category.deleteMany();

  const formatted = categories.map((cat) => ({
    name: cat
  }));

  await Category.insertMany(formatted);

  console.log("Categories seeded");
  process.exit();
};

seedCategories();