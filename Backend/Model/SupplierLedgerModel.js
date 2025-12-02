// models/SupplierLedgerModel.js
const mongoose = require("mongoose");

const SupplierLedgerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    date: { type: Date, required: true },
    particulars: { type: String },
    purchaseNo: { type: String },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierLedger", SupplierLedgerSchema);
