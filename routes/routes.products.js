const router = require("express").Router();
const { ROLES } = require("../config/constants");
const productController = require("../controllers/products.controller");
// const upload = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");
const createUploader = require("../middlewares/upload")

const uploadProduct= createUploader("products")

router.get("/",productController.getProducts)
router.get("/:id",productController.getProductById)
router.post("/",verifyToken(ROLES.ADMIN),uploadProduct.single("img"), productController.createProduct)
router.patch("/:id",verifyToken(ROLES.ADMIN),productController.updateProduct)
module.exports = router;