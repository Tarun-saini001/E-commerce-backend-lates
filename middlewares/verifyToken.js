const jwt = require("jsonwebtoken");
const user = require("../models/user");

function verifyToken(...allowedRoles) {
  return async (req, res, next) => {

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

      const user = await user.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "User Deactivated" });
      }

      if (allowedRoles.length && !allowedRoles.includes(Number(decoded.role))) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.log("jwt error", error);
      return res.status(401).json({ message: "Invalid token" });
    }

  }
}
module.exports = verifyToken;