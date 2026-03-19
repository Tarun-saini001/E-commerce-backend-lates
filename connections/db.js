const mongoose = require("mongoose");

const connectDatabase=  async () => {
    try {
        console.log('(process.env.MONGO_URI:',process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI,  {
      serverSelectionTimeoutMS: 30000, // increase timeout
    });
        console.log("Database connected successfully..!");
    } catch (error) {
        console.log("Connection failed",error);
    }
}

module.exports={connectDatabase};