const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const cartController = require("../controllers/cart.controller");

router.post("/add", verifyToken, cartController.addToCart);

module.exports = router;