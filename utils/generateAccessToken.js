const jwt = require("jsonwebtoken")

const generateAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        const userInfo = { id: user._id };
        jwt.sign(userInfo, process.env.JWT_SECRET_KEY, { expiresIn: "15m" }, (err, token) => {
            if (err) {
                return reject("Something went wrong while generating token")
            }
            else
                resolve(token);
        })
    })
}

module.exports=generateAccessToken