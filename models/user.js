const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    name:{type:String},
    email:{type: String},
    password:{type:String},
    confirmPassword:{type:String},
    isVerified:{type: String, default:false}
},{timestamps:true});


const user =mongoose.model("user",userModel);
module.exports= user;