const express = require("express");
require("dotenv").config();
const cors = require("cors")
const cookieParser = require("cookie-parser")
const db = require("./connections/db")
const Roters =require("./routes")
const app = express();



db.connectDatabase();
app.use(cookieParser())

app.use(cors({
    origin:process.env.ALLOW_ORIGIN,
    credentials:true
}))

app.use(express.json());
app.use("/service",Roters)

app.listen(process.env.PORT, ()=>{
    console.log(`Server Stareted at ${process.env.PORT}`)
})