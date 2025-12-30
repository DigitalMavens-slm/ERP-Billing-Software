const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
 
  companyName: String,
  contactPerson: String,
  mobile1: String,
  mobile2: String,
  email: String,
  website: String,
  industry: String,
  financialYear: String,
  currency: String,
  gstType: String,
  compositionScheme: Boolean,
  gstNo: String,
  panNo: String,
  loginUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
       invoicePrefix: {
    type: String,
    default: "INV",
  },
//   companyId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Company",
//   required: true,
// },

  invoiceStartNumber: {
    type: Number,
    default: 1,
  },

  lastInvoiceNumber: {
    type: Number,
    default: 0,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    bankName: String
  },
  gstLocked: {
  type: Boolean,
  default: false
},
  logoUrl: String,
  paymentUrl: String,
  extraPaymentUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);

