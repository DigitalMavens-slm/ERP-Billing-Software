const OrderModel = require("../Model/SalesModel");
const Inventory = require('../Model/InventoryModel');

exports.getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Add new order
exports.addOrder = async (req, res) => {
  try {
    const { customerName, product, quantity, price } = req.body;

    const newOrder = new OrderModel({
      customerName,
      product,
      quantity,
      price,
      status: "Pending",
    });
    
    Inventory.quantity=Inventory.quantity-quantity
    Inventory.lastUpdated= new Date()
    await Inventory.save()

    await newOrder.save();
    res.status(201).json({ message: "Order added successfully", newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.searchField = async (req, res) => {
  try {
    const { field, query } = req.query;
    console.log(req.query);
    

    if (!field || !query) return res.json([]);

    // Only allow certain fields
    const allowedFields = ["customerName", "product"];
    if (!allowedFields.includes(field))
      return res.status(400).json({ message: "Invalid field" });

    // Build regex search
    const results = await OrderModel.find({
      [field]: { $regex: query, $options: "i" },
    })
      .limit(10)
      // .select(field);

    // Return unique suggestions only
    const unique = [...new Set(results.map((r) => r[field]))];
    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
