const mongoose = require("mongoose");

const LedgerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
//      financialYear: {
//   type: String,
//   required: true,
//   index: true
// },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: false, // 🔥 added this
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    particulars: {
      type: String,
      required: true,
    },
    invoiceNo: {
      type: String,
      default: "-",
    },
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ledger", LedgerSchema);
