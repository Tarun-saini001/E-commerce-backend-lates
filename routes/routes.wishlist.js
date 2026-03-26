const verifyToken = require("../middlewares/verifyToken");
const wishlistController = require("../controllers/wishlist.controller");
const { ROLES } = require("../config/constants");

const router = require("express").Router();

router.post("/add",verifyToken(ROLES.USER),wishlistController.addToCart)
router.get("/",verifyToken(ROLES.USER),wishlistController.getWishlist)
router.delete("/:productId",verifyToken(ROLES.USER),wishlistController.removeWishlistItem)
router.post("/toggle",verifyToken(ROLES.USER),wishlistController.toggleWishlist)

module.exports = router;