const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
 
  companyName: String,
  contactPerson: String,
  mobile1: String,
  mobile2: String,
  email: String,
  website: String,
  industry: String,
  currentFinancialYear: String,
  financialYearStart: String,
  financialYearEnd: String,
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
  logoUrl: String,
  paymentUrl: String,
  extraPaymentUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);

