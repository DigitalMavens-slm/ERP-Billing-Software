const express=require("express")
const multer=require("multer")
const router=express.Router()
const upload = multer({ dest: "uploads/" });
const { createbrand,getallbrand,deletebrand,exportBrandsExcel,importBrandsExcel}=require("../Controller/BrandController")



router.post("/brands",createbrand)
router.get("/brands",getallbrand)
router.delete("/brands/:id",deletebrand)

router.get("/export/Brand/export/excel", exportBrandsExcel);
router.post("/import/Brand/excel", upload.single("file"), importBrandsExcel);

module.exports=router