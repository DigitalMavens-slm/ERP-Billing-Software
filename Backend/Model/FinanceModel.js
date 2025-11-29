const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Invoice", "Payment", "Expense"],
    required: true,
  },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  relatedCustomer: { type: String, default: "" },
  relatedSupplier: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Finance", financeSchema);
