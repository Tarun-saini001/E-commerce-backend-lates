const router = require("express").Router();
const productController = require("../controllers/products.controller");

router.get("/",productController.getProducts)
router.get("/:id",productController.getProductById)
router.post("/",productController.createProduct)

module.exports = router;