const express = require("express");
const router = express.Router();
const categoryController = require("../Controller/CategoryController");
const { AllModelExportExcel } = require("../Utills/AllModelExportExcel");
const {AllModelImportExcel}=require("../Utills/AllModelImportExcel")
const multer=require("multer")

const upload = multer({ dest: "uploads/" });

router.get("/categories", categoryController.getCategories);
router.post("/categories", categoryController.createCategory);
router.delete("/categories/:id",categoryController.deleteCategory)

router.get(`/export/:modelname/export/excel`, AllModelExportExcel);
router.post("/import/:modelname/excel",upload.single("file"),AllModelImportExcel)

// router.get("/export/Brand/export/excel", );
// router.post("/import/Brand/excel", upload.single("file"), importBrandsExcel);

module.exports = router;
