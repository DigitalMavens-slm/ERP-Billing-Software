const  ExcelConverter=require("./ExportExcel")
// const{Brand,} =require("../Model/BrandModel")
const ProductFormModel = require("../Model/ProductFormModel")
const BrandModel = require("../Model/BrandModel")
const CategoryModel = require("../Model/CategoryModel")
const CustomerModel=require("../Model/CustomerModel")
const SupplierModel=require("../Model/SupplierModel")



const ModelMap={
    Brand:BrandModel,
    Product:ProductFormModel,
    Category:CategoryModel,
    Customer:CustomerModel,
    Supplier:SupplierModel
}



exports.AllModelExportExcel=async(req,res)=>{
    console.log(req.params.modelname)
    const {modelname}=req.params
    const Model=ModelMap[modelname]

    const filename=`${modelname}s.xlsx`
    await ExcelConverter(Model,res,modelname,filename)
    
}