const router = require("express").Router();
const { ROLES } = require("../config/constants");
const categoryController = require("../controllers/category.controller");
const createUploader = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");

const uploadCategory= createUploader("categories")

router.get("/",categoryController.getCategories)
router.post("/",verifyToken(ROLES.ADMIN),uploadCategory.single("image"),categoryController.addCategory)
router.delete("/:id",verifyToken(ROLES.ADMIN),categoryController.deleteCategory)
router.patch("/:id",verifyToken(ROLES.ADMIN),uploadCategory.single("image"),categoryController.updateCategory)

module.exports = router;