const mongoose = require("mongoose");
const Product = require("../models/product");

const seedProducts = async () => {
  try {
    // console.log('process.env.MONGO_URI: ', process.env.MONGO_URI);
    await mongoose.connect("mongodb://localhost:27017/e-commerce");

    // // clear old data (optional)
    // await Product.deleteMany();

    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();

    await Product.insertMany(data.products);

    console.log("Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();