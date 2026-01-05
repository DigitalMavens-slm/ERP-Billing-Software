const Company = require("../Model/CompanysettingModel"); // correct import
const User = require("../Model/userModel"); // correct import
const getFinancialYear=require("../Utills/getFinancialYear")



exports.getCompanySettings = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user || !user.companyId) {
      return res.json(null); 
    }

    const company = await Company.findById(user.companyId);
    return res.json(company);

  } catch (err) {
    console.error("GET company error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.createCompanySettings = async (req, res) => {
  try {
    const data = { ...req.body };

    data.invoicePrefix = "INV";
    data.financialYear = getFinancialYear();

    if (req.files) {
      if (req.files.logoUrl) data.logoUrl = req.files.logoUrl[0].path;
      if (req.files.paymentUrl) data.paymentUrl = req.files.paymentUrl[0].path;
      if (req.files.extraPaymentUrl)
        data.extraPaymentUrl = req.files.extraPaymentUrl[0].path;
    }

    const user = await User.findById(req.user);

    const existingCompany = user.companyId
      ? await Company.findById(user.companyId)
      : null;

    if (
      existingCompany &&
      existingCompany.invoiceStartNumber &&
      data.invoiceStartNumber &&
      String(existingCompany.invoiceStartNumber) !==
        String(data.invoiceStartNumber)
    ) {
      return res.status(400).json({
        message: "Invoice start number already set and cannot be changed",
      });
    }

    if (
  existingCompany &&
  existingCompany.gstLocked &&
  data.gstNo &&
  data.gstNo !== existingCompany.gstNo
) {
  return res.status(400).json({
    message: "GST number already registered and cannot be changed",
  });
}

if (existingCompany && !existingCompany.gstLocked &&data.gstNo) {
  data.gstLocked = true;
  data.gstType = "REGISTERED";
}




    if (existingCompany) {
      delete data._id;

      const updatedCompany = await Company.findByIdAndUpdate(
        existingCompany._id,
        data,
        { new: true }
      );

      return res.status(200).json({
        message: "Company updated successfully",
        company: updatedCompany,
      });
    }

    // 🆕 CREATE FLOW (first time only)
    data.loginUser = req.user;

    if (data.gstNo) {
  data.gstLocked = true;
  data.gstType = "REGISTERED";
}
    const newCompany = await Company.create(data);

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

