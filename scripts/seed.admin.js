require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const user = require("../models/user");
const { ROLES } = require("../config/constants");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        const admin = [{
            name: "Admin",
            email: "admin@yopmail.com",
            password: hashedPassword,
            isVerified: true,
            isActive: true,
            role: ROLES.ADMIN,
        }]


        // await User.insertMany(users);
        await user.insertMany(admin);

        console.log("Admin seeded successfully");
        process.exit();

    } catch (error) {
        console.log(" Seed admin error:", error);
        process.exit(1);
    }
};

seedAdmin();