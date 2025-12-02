const express = require("express");
const router = express.Router();
const CustomerController = require("../Controller/CustomerController");
const { AllModelExportExcel } = require("../Utills/AllModelExportExcel");
const {AllModelImportExcel }=require("../Utills/AllModelImportExcel")
const multer=require("multer")
const auth = require("../Middlewares/auth")
const upload = multer({ dest: "uploads/" });
const companyCheck = require("../Middlewares/companyCheck");


router.get("/customers", auth, companyCheck, CustomerController.getCustomers);
router.post("/customers",auth, companyCheck, CustomerController.createCustomer);
router.delete("/customers/:id", CustomerController.deleteCustomer);


router.get("/export/:modelname/export/excel",AllModelExportExcel);
router.post("/import/:modelname/excel",upload.single("file"),AllModelImportExcel);

module.exports = router;
