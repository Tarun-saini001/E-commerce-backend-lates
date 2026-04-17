const express = require("express");
require("dotenv").config();
const cors = require("cors")
const cookieParser = require("cookie-parser")
const db = require("./connections/db")
const Roters = require("./routes")
const app = express();
const path = require("path")



db.connectDatabase();
app.use(express.json());
app.use(cookieParser())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({
    origin:process.env.ALLOW_ORIGIN,
    // origin: "http://localhost:5173",
    credentials: true
}))

app.use("/service", Roters)

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server Stareted at ${process.env.PORT}`)
})