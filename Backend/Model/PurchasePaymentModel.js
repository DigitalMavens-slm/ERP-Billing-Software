const mongoose = require("mongoose");

const PurchasePaymentSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    amount: { type: Number, required: true },
    mode: { type: String, enum: ["Cash", "Bank", "UPI", "Cheque"], default: "Cash" },
    txnId: { type: String },
    remarks: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchasePayment", PurchasePaymentSchema);
