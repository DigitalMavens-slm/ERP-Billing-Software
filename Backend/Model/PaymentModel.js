const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {

      customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true, // ⚠️ important for ledger sync
    },
    // 🔹 Invoice reference
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice", 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    mode: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank", "Cheque", "Other"], 
    },
    txnId: {
      type: String,
      default: null, // UPI / bank txn ID optional
    },
    date: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } ,// automatically adds createdAt, updatedAt
);

module.exports = mongoose.model("Payment", paymentSchema);
