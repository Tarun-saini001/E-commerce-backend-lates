const router = require("express").Router();
const productController = require("../controllers/products.controller");

router.get("/",productController.getProducts)
router.get("/:id",productController.getProductById)

module.exports = router;