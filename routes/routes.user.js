const router = require("express").Router();
const { ROLES } = require("../config/constants");
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/register", authController.register);
router.post("/send-otp", authController.sendOTP);
router.post("/verifyOtp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);
router.post("/logout", authController.logout);

router.get("/me", verifyToken(ROLES.USER,ROLES.ADMIN), authController.getUser);

router.post("/change-password", verifyToken(ROLES.USER,ROLES.ADMIN), authController.changePassword);

router.get("/users",verifyToken(ROLES.ADMIN),authController.getAllUsers)

router.patch("/changeStatus/:userId",verifyToken(ROLES.ADMIN),authController.toggleUserActiveStatus)
router.get("/dashboard",verifyToken(ROLES.ADMIN),authController.getDashboardStats)
module.exports = router;