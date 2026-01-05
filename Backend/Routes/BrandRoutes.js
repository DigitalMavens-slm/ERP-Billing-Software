const express=require("express")
const multer=require("multer")
const router=express.Router()
const upload = multer({ dest: "uploads/" });
const { createbrand,getallbrand,deletebrand,exportBrandsExcel,importBrandsExcel}=require("../Controller/BrandController")
const auth=require("../Middlewares/auth")
const companyCheck=require("../Middlewares/companyCheck")


router.post("/brands",auth,companyCheck,createbrand)
router.get("/brands",auth,companyCheck,getallbrand)
router.delete("/brands/:id",deletebrand)

router.get("/export/Brand/export/excel", auth,companyCheck,exportBrandsExcel);
router.post("/import/Brand/excel", upload.single("file"), auth,companyCheck,importBrandsExcel);

module.exports=router