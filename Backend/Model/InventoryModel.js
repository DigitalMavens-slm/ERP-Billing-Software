
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",   // un product model name enna use panniyo adhe podu
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    qty: {
      type: Number,
      default: 0,
    },
    minQty: {
      type: Number,
      default: 0,
    },
      totalPurchased: { type: Number, default: 0 },  // lifetime purchase count
    totalSold: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
