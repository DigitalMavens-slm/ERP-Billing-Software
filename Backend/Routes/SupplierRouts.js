const express = require("express");
const router = express.Router();
const multer=require("multer")
const { getSuppliers, addSupplier, deleteSupplier } = require("../Controller/SupplierController");
const { AllModelExportExcel } = require("../Utills/AllModelExportExcel");
const { AllModelImportExcel }=require("../Utills/AllModelImportExcel")
const upload = multer({ dest: "uploads/" });



router.get("/suppliers", getSuppliers);
router.post("/suppliers", addSupplier);
router.delete("/suppliers/:id", deleteSupplier);


router.get("/export/:modelname/export/excel",AllModelExportExcel)
router.post("/import/:modelname/excel", upload.single("file"), AllModelImportExcel);


module.exports = router;
