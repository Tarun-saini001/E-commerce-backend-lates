const verifyToken = require("../middlewares/verifyToken");
const wishlistController = require("../controllers/wishlist.controller");

const router = require("express").Router();

router.post("/add",verifyToken,wishlistController.addToCart)
router.get("/",verifyToken,wishlistController.getWishlist)
router.delete("/:productId",verifyToken,wishlistController.removeWishlistItem)
router.post("/toggle",verifyToken,wishlistController.toggleWishlist)

module.exports = router;