const express = require("express");
const router = express.Router();
const CustomerController = require("../Controller/CustomerController");
const { AllModelExportExcel } = require("../Utills/AllModelExportExcel");
const {AllModelImportExcel }=require("../Utills/AllModelImportExcel")
const multer=require("multer")

const upload = multer({ dest: "uploads/" });



router.get("/customers", CustomerController.getCustomers);
router.post("/customers", CustomerController.createCustomer);
router.delete("/customers/:id", CustomerController.deleteCustomer);


router.get("/export/:modelname/export/excel",AllModelExportExcel);
router.post("/import/:modelname/excel",upload.single("file"),AllModelImportExcel);

module.exports = router;
