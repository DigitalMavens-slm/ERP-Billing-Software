const Inventory = require("../Model/InventoryModel");
const Product = require("../Model/ProductFormModel");


exports.getInventory = async (req, res) => {
  try {
    const companyId = req.companyId;
    // Only fetch records belonging to that company
    const data = await Inventory.find({ companyId }).populate("productId");
  // console.log(data)
    res.json(data);
  } catch (err) {
    console.error("Inventory Error:", err);
    res.status(500).json({ error: err.message });
  }
};
