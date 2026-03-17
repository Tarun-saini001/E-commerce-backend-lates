const router = require("express").Router();
const validate = require("../middlewares/validateRequest");
const verifyToken = require("../middlewares/verifyToken");
const orderController = require("../controllers/order.controller");
const { orderSchema } = require("../validations/order");

router.post("/add",verifyToken,validate(orderSchema),orderController.createOrder)

module.exports = router;