const express = require("express");
const router = express.Router();
const ProductController = require("../Controller/ProductFormController");
const auth = require("../Middlewares/auth");
const companyCheck = require("../Middlewares/companyCheck");

// const Category=require("../Controller/CategoryController");
// const SubCategory=require("../Controller/SubCategoryController");
// const Brand=require("../Controller/BrandController")
// router.get("/subcategories",SubCategory.getSubCategories)
// router.get("/categories",Category.getCategories)
// router.get("/brands",Brand.getBrands)


router.get("/products",auth, companyCheck, ProductController.getProducts);
router.post("/products", auth, companyCheck, ProductController.createProduct);
router.delete("/products/:id",auth,companyCheck, ProductController.deleteProduct);


module.exports = router;
