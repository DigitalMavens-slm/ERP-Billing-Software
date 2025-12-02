
const mongoose = require("mongoose");

// 🔹 Item Schema (for each product line)
const itemSchema = new mongoose.Schema({
    productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  product: { type: String, required: true },
  qty: { type: Number, required: true },
  mrp: { type: Number, default: 0 },
  rate: { type: Number, required: true },
  dis: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
});


// 🔹 Main Purchase Schema
const purchaseSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    billNum: { type: String, unique: true },
    date: { type: String, required: true },
    purchaseType: { type: String, default: "Purchase" },
    supplierName: { type: String, required: true },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    billType: { type: String, default: "Cash" },
    gstType: { type: String, default: "GST" },
    amountType: { type: String, default: "Excluding Tax" },

    items: [itemSchema],

    subtotal: { type: Number, required: true },
    totalQty: { type: Number, required: true },

    totalAmount: { type: Number, required: true, default: 0 },
    totalPaid: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Partially Paid", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// 🔹 Auto-generate incremental Bill Number (like invoice auto INV0001)
purchaseSchema.pre("save", async function (next) {
  if (this.billNum) return next(); // skip if already set

  try {
    const lastPurchase = await mongoose
      .model("Purchase")
      .findOne({}, {}, { sort: { createdAt: -1 } });

    let nextNum = 1;
    if (lastPurchase && lastPurchase.billNum) {
      const lastNum = parseInt(lastPurchase.billNum.replace("BILL", "")) || 0;
      nextNum = lastNum + 1;
    }

    this.billNum = `BILL${String(nextNum).padStart(4, "0")}`;
    // res.json([BillNo:this.billNum])
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Purchase", purchaseSchema);
