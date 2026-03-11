const Token = require("../models/token");

exports.createToken = async (refreshToken, userId, expiresAt) => {
    try {
        return await Token.create({
            refreshToken,
            userId,
            expiresAt
        });
    } catch (error) {
        console.log("Error creating token:", error);
        throw error;
    }
};

exports.findToken = async (refreshToken) => {
    try {
        return await Token.findOne({ refreshToken });
    } catch (error) {
        console.log("Error finding token:", error);
        throw error;
    }
};

exports.deleteTokenById = async (id) => {
    try {
        return await Token.deleteOne({ _id: id });
    } catch (error) {
        console.log("Error deleting token:", error);
        throw error;
    }
};

exports.deleteToken = async (refreshToken) => {
    try {
        return await Token.deleteOne({ refreshToken });
    } catch (error) {
        console.log("Error deleting refresh token:", error);
        throw error;
    }
};