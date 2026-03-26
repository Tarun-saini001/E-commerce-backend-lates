const router = require("express").Router();
const validate = require("../middlewares/validateRequest");
const verifyToken = require("../middlewares/verifyToken");
const orderController = require("../controllers/order.controller");
const { orderSchema } = require("../validations/order");
const { ROLES } = require("../config/constants");

router.post("/add",verifyToken(ROLES.USER),validate(orderSchema),orderController.createOrder)
router.get("/", verifyToken(ROLES.USER), orderController.getOrders);
router.get("/:id",verifyToken(ROLES.USER),orderController.getOrderById)

module.exports = router;