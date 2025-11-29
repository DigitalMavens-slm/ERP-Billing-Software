const Brand=require("../Model/BrandModel")
// const { Parser } = require("json2csv");
const XLSX = require("xlsx");

const multer = require("multer");
// const csv = require("csv-parser");
const fs = require("fs");

exports.createbrand= async(req,res)=>{
    console.log(req.body);
    try{
        const name=req.body
        console.log(name)
        const newbrand= await Brand.create( name )
        
        newbrand.save()
        // console.log(newbrand);
        res.status(200).json(newbrand)
    }
    catch(err){
        res.status(500).json(err)
    }
}

exports.getallbrand= async(req,res)=>{
    try{
        const brands= await Brand.find()
        res.status(200).json(brands)
    }
    catch(err){
        res.status(500).json(err)
    }
}


exports.deletebrand=async (req,res)=>{
   const id= req.params.id
    try{
        const deletebrand= await Brand.findByIdAndDelete(id)
        res.status(200).json(deletebrand)
    }
    catch(err){
        res.status(500).json(err)
    }
}


const exportModelToExcel = require("../Utills/ExportExcel");
const importModelToExcel=require("../Utills/ImportExcel")

exports.exportBrandsExcel = async (req, res) => {
    
  await exportModelToExcel(Brand, res, "Brands", "brands.xlsx");
};


exports.importBrandsExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  await importModelToExcel(Brand, req.file.path, res);
};




