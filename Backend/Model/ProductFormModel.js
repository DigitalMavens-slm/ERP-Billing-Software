const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },
  name: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: false,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: false,
  },
  mrp: Number,
  purchaseRate: Number,
  saleRate: Number,
  gst: Number,
  barcode: String,
  unit: String,
  commission: Number,
  minOrderQty: Number,
});


module.exports = mongoose.model("Product", productSchema);
