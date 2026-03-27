const router = require("express").Router();
const validate = require("../middlewares/validateRequest");
const verifyToken = require("../middlewares/verifyToken");
const orderController = require("../controllers/order.controller");
const { orderSchema } = require("../validations/order");
const { ROLES } = require("../config/constants");

router.post("/add",verifyToken(ROLES.USER,ROLES.ADMIN),validate(orderSchema),orderController.createOrder)
router.get("/", verifyToken(ROLES.USER,ROLES.ADMIN), orderController.getOrders);
router.get("/:id",verifyToken(ROLES.USER,ROLES.ADMIN),orderController.getOrderById)

module.exports = router;