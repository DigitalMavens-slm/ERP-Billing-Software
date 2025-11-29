const importExcelConverter = require("./ImportExcel");

// Models import
const ProductFormModel = require("../Model/ProductFormModel");
const BrandModel = require("../Model/BrandModel");
const CategoryModel = require("../Model/CategoryModel");
const CustomerModel = require("../Model/CustomerModel");
const SupplierModel = require("../Model/SupplierModel");

// Common model map
const ModelMap = {
  Brand: BrandModel,
  Product: ProductFormModel,
  Category: CategoryModel,
  Customer: CustomerModel,
  Supplier: SupplierModel,
};

exports.AllModelImportExcel = async (req, res) => {

//   try {
    const { modelname } = req.params;
    console.log(modelname);
    
    const Model = ModelMap[modelname];

    // if (!Model) {
    //   return res.status(400).json({ message: "Invalid model name" });
    // }

    // File path check
    // if (!req.file || !req.file.path) {
    //   return res.status(400).json({ message: "No file uploaded" });
    // }

    // Use same ImportExcel utility
    await importExcelConverter(Model, req.file.path,res);
    res.status(200).json({message:"success"})

//   } catch (err) {
//     console.error("Import error:", err);
//     res.status(500).json({ message: "Import failed", error: err.message });
//   }
};
