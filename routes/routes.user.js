const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/register", authController.register);
router.post("/send-otp", authController.sendOTP);
router.post("/verifyOtp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);
router.post("/logout", authController.logout);

router.get("/me", verifyToken, authController.getUser);

router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;