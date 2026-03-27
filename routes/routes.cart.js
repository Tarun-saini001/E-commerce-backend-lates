const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const cartController = require("../controllers/cart.controller");
const { ROLES } = require("../config/constants");

router.post("/add", verifyToken(ROLES.USER,ROLES.ADMIN), cartController.addToCart);
router.get("/",verifyToken(ROLES.USER,ROLES.ADMIN),cartController.getCart);
router.patch("/update/:productId",verifyToken(ROLES.USER,ROLES.ADMIN),cartController.updateCart)
router.delete("/:productId",verifyToken(ROLES.USER,ROLES.ADMIN),cartController.removeItem)
router.delete("/",verifyToken(ROLES.USER,ROLES.ADMIN),cartController.clearCart)

module.exports = router;