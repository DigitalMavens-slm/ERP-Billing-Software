const express = require("express");
const router = express.Router();
const multer=require("multer")
const { getSuppliers, addSupplier, deleteSupplier } = require("../Controller/SupplierController");
const { AllModelExportExcel } = require("../Utills/AllModelExportExcel");
const { AllModelImportExcel }=require("../Utills/AllModelImportExcel")
const upload = multer({ dest: "uploads/" });
const auth = require("../Middlewares/auth");
const companyCheck = require("../Middlewares/companyCheck");



router.get("/suppliers",auth,companyCheck, getSuppliers);
router.post("/suppliers", auth, companyCheck, addSupplier);
router.delete("/suppliers/:id", deleteSupplier);


router.get("/export/:modelname/export/excel",AllModelExportExcel)
router.post("/import/:modelname/excel", upload.single("file"), AllModelImportExcel);


module.exports = router;
