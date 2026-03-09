const jwt = require("jsonwebtoken")

const generateRefreshToken = (user) => {
    return new Promise((resolve, reject) => {
        const userInfo = { id: user._id };
        jwt.sign(userInfo, process.env.REFRESH_SECRET_KEY, { expiresIn: "7d" }, (err, token) => {
            if (err) {
                return reject("Something went wrong while generating token")
            }
            else
                resolve(token);
        })
    })
}

module.exports=generateRefreshToken