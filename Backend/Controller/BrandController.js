// const Brand=require("../Model/BrandModel")
// // const { Parser } = require("json2csv");
// const XLSX = require("xlsx");

// const multer = require("multer");
// // const csv = require("csv-parser");
// const fs = require("fs");

// exports.createbrand= async(req,res)=>{
//     console.log(req.body);
//     try{
//         const name=req.body
//         console.log(name)
//         const newbrand= await Brand.create( name )
        
//         newbrand.save()
//         // console.log(newbrand);
//         res.status(200).json(newbrand)
//     }
//     catch(err){
//         res.status(500).json(err)
//     }
// }

// exports.getallbrand= async(req,res)=>{
//     try{
//         const brands= await Brand.find()
//         res.status(200).json(brands)
//     }
//     catch(err){
//         res.status(500).json(err)
//     }
// }


// exports.deletebrand=async (req,res)=>{
//    const id= req.params.id
//     try{
//         const deletebrand= await Brand.findByIdAndDelete(id)
//         res.status(200).json(deletebrand)
//     }
//     catch(err){
//         res.status(500).json(err)
//     }
// }


// const exportModelToExcel = require("../Utills/ExportExcel");
// const importModelToExcel=require("../Utills/ImportExcel")

// exports.exportBrandsExcel = async (req, res) => {
    
//   await exportModelToExcel(Brand, res, "Brands", "brands.xlsx");
// };


// exports.importBrandsExcel = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   await importModelToExcel(Brand, req.file.path, res);
// };



const Brand = require("../Model/BrandModel");
const XLSX = require("xlsx");
const fs = require("fs");

const exportModelToExcel = require("../Utills/ExportExcel");
const importModelToExcel = require("../Utills/ImportExcel");

/**
 * CREATE BRAND
 */
exports.createbrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Brand name required" });
    }

    const newBrand = await Brand.create({
      name,
      companyId: req.user.companyId, // 🔥 important
    });

    res.status(201).json(newBrand);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * GET ALL BRANDS (company wise)
 */
exports.getallbrand = async (req, res) => {
  try {
    const brands = await Brand.find({
      companyId: req.user.companyId, // 🔥 filter
    });

    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * DELETE BRAND (company wise)
 */
exports.deletebrand = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Brand.findOneAndDelete({
      _id: id,
      companyId: req.user.companyId, // 🔥 secure delete
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Brand not found or not authorized",
      });
    }

    res.status(200).json({ message: "Brand deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * EXPORT BRANDS EXCEL (company wise)
 */
exports.exportBrandsExcel = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    await exportModelToExcel(
      Brand,
      res,
      "Brands",
      "brands.xlsx",
      { companyId } // 🔥 filter passed
    );
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * IMPORT BRANDS EXCEL (company wise)
 */
exports.importBrandsExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    await importModelToExcel(
      Brand,
      req.file.path,
      res,
      { companyId: req.user.companyId } // 🔥 auto attach
    );
  } catch (err) {
    res.status(500).json(err);
  }
};



