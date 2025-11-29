const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
  qty: { type: Number, default: 0 },
  minQty: { type: Number, default: 10 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
