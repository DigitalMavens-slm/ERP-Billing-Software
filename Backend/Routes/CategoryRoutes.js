const express = require("express");
const router = express.Router();
const categoryController = require("../Controller/CategoryController");
const { AllModelExportExcel } = require("../Utills/AllModelExportExcel");
const {AllModelImportExcel}=require("../Utills/AllModelImportExcel")
const multer=require("multer")
const auth=require("../Middlewares/auth")
const companyCheck=require("../Middlewares/companyCheck")

const upload = multer({ dest: "uploads/" });

router.get("/categories", auth,companyCheck, categoryController.getCategories);
router.post("/categories", auth,companyCheck, categoryController.createCategory);
router.delete("/categories/:id",auth,companyCheck, categoryController.deleteCategory);

router.get(`/export/:modelname/export/excel`,auth,companyCheck, AllModelExportExcel);
router.post("/import/:modelname/excel",upload.single("file"),auth,companyCheck,AllModelImportExcel)

// router.get("/export/Brand/export/excel", );
// router.post("/import/Brand/excel", upload.single("file"), importBrandsExcel);

module.exports = router;
