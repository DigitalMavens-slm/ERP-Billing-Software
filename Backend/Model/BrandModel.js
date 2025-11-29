const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Brand name is required"],  // ✅ Validation message
    trim: true,  // ✅ Avoid spaces-only strings
    // unique: true 
  },
}, { timestamps: true }); // ✅ (optional) for createdAt, updatedAt fields

const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
