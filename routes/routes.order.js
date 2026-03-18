const router = require("express").Router();
const validate = require("../middlewares/validateRequest");
const verifyToken = require("../middlewares/verifyToken");
const orderController = require("../controllers/order.controller");
const { orderSchema } = require("../validations/order");

router.post("/add",verifyToken,validate(orderSchema),orderController.createOrder)
router.get("/", verifyToken, orderController.getOrders);
router.get("/:id",verifyToken,orderController.getOrderById)

module.exports = router;