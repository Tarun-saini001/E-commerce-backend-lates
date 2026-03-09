const mongoose = require("mongoose")

const tokenModel = mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:"user",require:true},
    refreshToken:{type: String, required:true},
    expiresAt:{type: Date}
},{timestamp:true});

const refreshToken = mongoose.model("refreshToken",tokenModel);
module.exports=refreshToken;