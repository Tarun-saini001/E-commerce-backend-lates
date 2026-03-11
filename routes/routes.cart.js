const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const cartController = require("../controllers/cart.controller");

router.post("/add", verifyToken, cartController.addToCart);
router.get("/",verifyToken,cartController.getCart);
router.patch("/update/:productId",verifyToken,cartController.updateCart)
module.exports = router;