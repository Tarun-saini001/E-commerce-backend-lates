const OTP = require("../models/otp")

export async function findOneAndUpdate(data, query) {
    const res = await OTP.findOneAndUpdate(data, query).catch((error) => {
        console.log("Error while updating the otp")
        throw error
    })
    return res
}