const Product = require("../Model/ProductFormModel");
const Inventory=require("../Model/InventoryModel")

exports.getProducts = async (req, res) => {
  try {
    // Company ID from middleware
    const companyId = req.companyId;

    console.log("Id" + companyId)
    if (!companyId) {
      return res.status(400).json({ error: "Company not found for this user" });
    }

    const data = await Product.find({ companyId })
      .populate("brandId", "name")
      .populate("categoryId", "name")
      .populate("subCategoryId", "name");

    console.log(data)
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
 
    try {
    const data = new Product({
      companyId: req.companyId,
      ...req.body
    });
    const savedProduct=await data.save();
       await Inventory.create({
      productId: savedProduct._id,
      qty: 0,
      minQty: savedProduct.minOrderQty || 10
    });

    res.json({
      message: "Product added + inventory created",
      product: savedProduct
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

