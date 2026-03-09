const mongoose = require("mongoose");

const otpModel = mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    otpType: { type: Number, required: true, enum: [1, 2, 3] },
    expiresAt: { type: Date, required: true }
}, { timestamps: true })

const otp = mongoose.model("otp", otpModel);
module.exports = otp