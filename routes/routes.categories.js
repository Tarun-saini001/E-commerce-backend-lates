const router = require("express").Router();
const { ROLES } = require("../config/constants");
const categoryController = require("../controllers/category.controller");
const createUploader = require("../middlewares/upload");
const validate = require("../middlewares/validateRequest");
const verifyToken = require("../middlewares/verifyToken");
const { categorySchema } = require("../validations/category/createCategory");

const uploadCategory= createUploader("categories")

router.get("/",categoryController.getCategories)
router.post("/",verifyToken(ROLES.ADMIN),uploadCategory.single("image"),validate(categorySchema), categoryController.addCategory)
router.delete("/:id",verifyToken(ROLES.ADMIN),categoryController.deleteCategory)
router.patch("/:id",verifyToken(ROLES.ADMIN),uploadCategory.single("image"),categoryController.updateCategory)

// get all categories without pagination
router.get("/withoutPagination",categoryController.getAllCategories)
module.exports = router;