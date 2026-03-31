const router = require("express").Router();
const { ROLES } = require("../config/constants");
const productController = require("../controllers/products.controller");
const upload = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");


router.get("/",productController.getProducts)
router.get("/:id",verifyToken(ROLES.ADMIN,ROLES.USER),productController.getProductById)
router.post("/",verifyToken(ROLES.ADMIN),upload.single("img"), productController.createProduct)
router.patch("/:id",verifyToken(ROLES.ADMIN),productController.updateProduct)
module.exports = router;