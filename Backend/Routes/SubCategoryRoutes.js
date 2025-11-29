const express = require("express");
const router = express.Router();
const subCategoryController = require("../Controller/SubCategoryController");
const CategoryController=require("../Controller/CategoryController")

router.get("/categories",CategoryController.getCategories)
router.get("/subcategories", subCategoryController.getSubCategories);
router.post("/subcategories", subCategoryController.createSubCategory);
router.delete("/subcategories/:id", subCategoryController.deleteSubCategory);

module.exports = router;
