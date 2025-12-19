
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
   productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
  product: String,
  qty: Number,
  mrp: Number,
  rate: Number,
  dis: Number,
  tax: Number,
});



const invoiceSchema = new mongoose.Schema(
  {
     companyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
          default: null,
        },
    invoiceNum: { type: String, },
    date: { type: String, required: true },
    invoiceType: String,
    customerName: String,
    customerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Customer",
  required: true,
},
 financialYear: {
  type: String,
  required: true,
  index: true
},
    billType: String,
     roundOff:Number,
      payableAmount:Number,
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
isDeleted: {
  type: Boolean,
  default: false,
  index: true,
},
deletedAt: {
  type: Date,
},

  },
  { timestamps: true }
);


module.exports = mongoose.model("Invoice", invoiceSchema);



