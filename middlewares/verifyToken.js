const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {

  let token = req.cookies?.accessToken;

  if (!token) {
    const authHeader = req.headers.authorization || "";
    token = authHeader.replace(/^Bearer\s+/i, "").trim();
  }


  // console.log('token: ', token);
  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }
// console.log("reach")
// console.log("SECRET:", process.env.JWT_SECRET_KEY);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('decoded: ', decoded);
    req.user = decoded.id;
    next(); 
  } catch (error) {
    console.log("jwt error",error);
    return res.status(401).json({ message: "Invalid token" });
  }

}

module.exports = verifyToken;