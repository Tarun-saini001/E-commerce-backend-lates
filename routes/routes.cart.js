const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const cartController = require("../controllers/cart.controller");
const { ROLES } = require("../config/constants");

router.post("/add", verifyToken(ROLES.USER), cartController.addToCart);
router.get("/",verifyToken(ROLES.USER),cartController.getCart);
router.patch("/update/:productId",verifyToken(ROLES.USER),cartController.updateCart)
router.delete("/:productId",verifyToken(ROLES.USER),cartController.removeItem)
router.delete("/",verifyToken(ROLES.USER),cartController.clearCart)

module.exports = router;