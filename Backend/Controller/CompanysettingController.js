const Company = require("../Model/CompanysettingModel"); // correct import
// const CompanySetting = require("../Model/CompanysettingModel");
const User = require("../Model/userModel"); // correct import
const getFinancialYear=require("../Utills/getFinancialYear")



exports.getCompanySettings = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user || !user.companyId) {
      return res.json(null); // NEW USER → NO COMPANY YET
    }

    const company = await Company.findById(user.companyId);
    return res.json(company);

  } catch (err) {
    console.error("GET company error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// ✅ CREATE or UPDATE COMPANY SETTINGS (Single controller)
// ----------------------------------------------------
exports.createCompanySettings = async (req, res) => {
  try {
    const data ={...req.body};
    // data.companyId=req.companyId
    data.invoicePrefix = "INV";
        data.financialYear=getFinancialYear()
    // Handle file uploads
    if (req.files) {
      if (req.files.logoUrl) data.logoUrl = req.files.logoUrl[0].path;
      if (req.files.paymentUrl) data.paymentUrl = req.files.paymentUrl[0].path;
      if (req.files.extraPaymentUrl) 
        data.extraPaymentUrl = req.files.extraPaymentUrl[0].path;
    }

    // Get logged-in user
    const user = await User.findById(req.user);

    // ✅ UPDATE FLOW
    if (user.companyId) {
      delete data._id; // ❌ Prevent immutable field error

      const updatedCompany = await Company.findByIdAndUpdate(
        user.companyId,
        data,
        { new: true }
      );

      return res.status(200).json({
        message: "Company updated successfully",
        company: updatedCompany,
      });
    }


  

    // ✅ CREATE FLOW (first time only)
    data.loginUser = req.user;

    const newCompany = await Company.create(data);

    // Link company with user
    await User.findByIdAndUpdate(req.user, {
      companyId: newCompany._id,
    });

    return res.status(201).json({
      message: "Company created successfully",
      company: newCompany,
    });

  } catch (err) {
    console.error("Company creation/update error:", err);
    res.status(500).json({ error: err.message });
  }
};

