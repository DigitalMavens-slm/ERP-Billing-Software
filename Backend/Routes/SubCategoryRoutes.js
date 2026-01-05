const express = require("express");
const router = express.Router();
const subCategoryController = require("../Controller/SubCategoryController");
const CategoryController=require("../Controller/CategoryController")
const auth = require("../Middlewares/auth");
const companyCheck = require("../Middlewares/companyCheck");

router.get("/categories",auth,companyCheck,CategoryController.getCategories)
router.get("/subcategories", auth,companyCheck, subCategoryController.getSubCategories);
router.post("/subcategories", auth,companyCheck, subCategoryController.createSubCategory);
router.delete("/subcategories/:id", auth,companyCheck, subCategoryController.deleteSubCategory);

module.exports = router;
