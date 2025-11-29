
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  product: String,
  qty: Number,
  mrp: Number,
  rate: Number,
  dis: Number,
  tax: Number,
});



const invoiceSchema = new mongoose.Schema(
  {
    invoiceNum: { type: String, unique: true },
    date: { type: String, required: true },
    invoiceType: String,
    customerName: String,
    customerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Customer",
  required: true,
},
    billType: String,
    gstType: String,
    amountType: String,
    items: [itemSchema],
    subtotal: Number,
    totalQty: Number,
     totalAmount: { type: Number, required: true, default: 0 }, // final bill total
    totalPaid: { type: Number, default: 0 },                   // how much paid
    paymentStatus: {
      type: String,
      enum: ["Pending", "Partially Paid", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// 🔹 Auto-generate incremental invoiceNum inside same model
invoiceSchema.pre("save", async function (next) {
  if (this.invoiceNum) return next(); // already set -> skip

  try {
    const lastInvoice = await mongoose
      .model("Invoice")
      .findOne({}, {}, { sort: { createdAt: -1 } }); // find latest invoice

    let nextNum = 1;
    if (lastInvoice && lastInvoice.invoiceNum) {
      const lastNum = parseInt(lastInvoice.invoiceNum.replace("INV", "")) || 0;
      nextNum = lastNum + 1;
    }

    this.invoiceNum = `INV${String(nextNum).padStart(4, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Invoice", invoiceSchema);



