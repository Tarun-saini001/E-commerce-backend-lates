const verifyToken = require("../middlewares/verifyToken");
const wishlistController = require("../controllers/wishlist.controller");
const { ROLES } = require("../config/constants");

const router = require("express").Router();

router.post("/add",verifyToken(ROLES.USER,ROLES.ADMIN),wishlistController.addToCart)
router.get("/",verifyToken(ROLES.USER,ROLES.ADMIN),wishlistController.getWishlist)
router.delete("/:productId",verifyToken(ROLES.USER,ROLES.ADMIN),wishlistController.removeWishlistItem)
router.post("/toggle",verifyToken(ROLES.USER,ROLES.ADMIN),wishlistController.toggleWishlist)

module.exports = router;