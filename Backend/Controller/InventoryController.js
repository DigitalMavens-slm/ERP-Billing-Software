const Inventory = require("../Model/InventoryModel");
const Product = require("../Model/ProductFormModel");


exports.getInventory = async (req, res) => {
  try {
    const data = await Inventory.find().populate("productId");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

