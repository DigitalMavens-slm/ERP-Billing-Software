const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" },
});


const supplierSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    gstin: { type: String },
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
  },
  { timestamps: true } // auto createdAt & updatedAt
);

module.exports = mongoose.model("Supplier", supplierSchema);
