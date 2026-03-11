const OTP = require("../models/otp");

exports.saveOTP = async (email, otp, otpType) => {
    try {
        return await OTP.findOneAndUpdate(
            { email, otpType },
            {
                $set: {
                    email,
                    otp,
                    otpType,
                    expiresAt: new Date(Date.now() + 60 * 1000)
                }
            },
            {
                upsert: true,
                new: true
            }
        );
    } catch (error) {
        console.log("Error saving OTP:", error);
        throw error;
    }
};


exports.findOTP = async (email, otp, otpType) => {
    try {
        return await OTP.findOne({ email, otp, otpType });
    } catch (error) {
        console.log("Error finding OTP:", error);
        throw error;
    }
};


exports.deleteOTP = async (id) => {
    try {
        return await OTP.deleteOne({ _id: id });
    } catch (error) {
        console.log("Error deleting OTP:", error);
        throw error;
    }
};