const user = require("../models/user");

exports.findUserByEmail = async (email) => {
    try {
        return await user.findOne({ email });
    } catch (error) {
        console.log("Error fetching user by email:", error);
        throw error;
    }
};

exports.findUserById = async (id) => {
    try {
        return await user.findById(id);
    } catch (error) {
        console.log("Error fetching user by id:", error);
        throw error;
    }
};

exports.createUser = async (data) => {
    try {
        return await user.create(data);
    } catch (error) {
        console.log("Error creating user:", error);
        throw error;
    }
};

exports.updateUserPassword = async (id, password) => {
    try {
        return await user.findByIdAndUpdate(
            id,
            { password },
            { new: true }
        );
    } catch (error) {
        console.log("Error updating password:", error);
        throw error;
    }
};

exports.getUserWithoutPassword = async (id) => {
    try {
        return await user.findById(id).select("-password -confirmPassword");
    } catch (error) {
        console.log("Error fetching user profile:", error);
        throw error;
    }
};


exports.getAllUsers = async (filter, skip, limit) => {
    try {
        return await user.find(filter).select("-password -confirmPassword")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
    } catch (error) {
        console.log("Error fetching all user:", error);
        throw error;
    }
};

exports.getUsersCount = async (filter) => {
    return await user.countDocuments(filter);
};