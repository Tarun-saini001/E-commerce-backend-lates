const mongoose = require("mongoose");
const { ROLES } = require("../config/constants");

const userModel = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    isVerified: { type: String, default: false },
    isActive: { type: Boolean, default: true },
    role: { type: Number, enum: Object.values(ROLES), default: ROLES.USER, },
}, { timestamps: true });


const user = mongoose.model("user", userModel);
module.exports = user;