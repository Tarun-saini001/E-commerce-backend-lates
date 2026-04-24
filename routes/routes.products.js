const router = require("express").Router();
const { ROLES } = require("../config/constants");
const productController = require("../controllers/products.controller");
// const upload = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");
const createUploader = require("../middlewares/upload")
const validateRequest = require("../middlewares/validateRequest");
const { productSchema } = require("../validations/product/createProduct");

const uploadProduct= createUploader("products")

router.get("/",productController.getProducts)
router.get("/:id",productController.getProductById)
router.post("/",verifyToken(ROLES.ADMIN),uploadProduct.single("thumbnail"),validateRequest(productSchema), productController.createProduct)
router.patch("/:id",verifyToken(ROLES.ADMIN),uploadProduct.single("thumbnail"),validateRequest(productSchema),productController.updateProduct);
router.delete("/:id",verifyToken(ROLES.ADMIN),productController.deleteProduct)
// router.get("/dashboard",verifyToken(ROLES.ADMIN),productController.getDashboardStats)

module.exports = router;