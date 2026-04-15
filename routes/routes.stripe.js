const router = require("express").Router();
const { ROLES } = require("../config/constants");
const stripeController = require("../controllers/stripe.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/create-checkout-session",verifyToken(ROLES.USER),stripeController.createCheckoutSession)

module.exports = router;