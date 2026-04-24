const router = require("express").Router();
const { ROLES } = require("../config/constants");
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken");
const createUploader = require("../middlewares/upload")
const { updateUserSchema } = require("../validations/auth/update.user")
const validateRequest = require("../middlewares/validateRequest");
const { sendOtpSchema } = require("../validations/auth/send-otp");
const { verifyOtpSchema } = require("../validations/auth/verify-otp");
const { loginSchema } = require("../validations/auth/login");
const { changePasswordSchema } = require("../validations/auth/change-password");
const uploadProfile = createUploader("profile")

router.post("/register", authController.register);
router.post("/send-otp", validateRequest(sendOtpSchema),authController.sendOTP);
router.post("/verifyOtp",validateRequest(verifyOtpSchema), authController.verifyOTP);
router.post("/login",validateRequest(loginSchema), authController.login);
router.post("/refreshToken", authController.refreshToken);
router.post("/logout", authController.logout);

router.get("/me", verifyToken(ROLES.USER, ROLES.ADMIN), authController.getUser);

router.post("/change-password", verifyToken(ROLES.USER, ROLES.ADMIN),validateRequest(changePasswordSchema), authController.changePassword);

router.get("/users", verifyToken(ROLES.ADMIN), authController.getAllUsers)

router.patch("/changeStatus/:userId", verifyToken(ROLES.ADMIN), authController.toggleUserActiveStatus)
router.get("/dashboard", verifyToken(ROLES.ADMIN), authController.getDashboardStats)
router.post("/uploadProfile", verifyToken(ROLES.USER, ROLES.ADMIN), uploadProfile.single("profilePic"), authController.uploadProfilePic)

router.patch("/", verifyToken(ROLES.USER, ROLES.ADMIN), validateRequest(updateUserSchema), authController.updateUser)
module.exports = router;