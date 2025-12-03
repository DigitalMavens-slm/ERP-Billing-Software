const Company = require("../Model/CompanysettingModel"); // correct import
const CompanySetting = require("../Model/CompanysettingModel");
const User = require("../Model/userModel"); // correct import

exports.getCompanySettings = async (req, res) => {
  try {
    const company = await Company.findOne();

    if (!company) return res.json(null);

    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCompanySettings = async (req, res) => {
  try {
    const data = req.body;

    // Handle file uploads
    if (req.files) {
      if (req.files.logoUrl) data.logoUrl = req.files.logoUrl[0].path;
      if (req.files.paymentUrl) data.paymentUrl = req.files.paymentUrl[0].path;
      if (req.files.extraPaymentUrl)
        data.extraPaymentUrl = req.files.extraPaymentUrl[0].path;
    }

    // Create new company
    const newCompany = await Company.create(data);

    // Assign this company to the user who created it
    await User.findByIdAndUpdate(req.user, {
      companyId: newCompany._id,
    });

    User.companyId = Company._id;
    await User.save();


    res.json(newCompany);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.saveCompanySettings = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // Handle uploaded files
    if (req.files) {
      if (req.files.logoUrl) data.logoUrl = req.files.logoUrl[0].path;
      if (req.files.paymentUrl) data.paymentUrl = req.files.paymentUrl[0].path;
      if (req.files.extraPaymentUrl)
        data.extraPaymentUrl = req.files.extraPaymentUrl[0].path;
    }

    // Update Company
    const updatedCompany = await Company.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update only the current user's companyId
    await User.findByIdAndUpdate(
      req.user,
      { companyId: id },
      { new: true }
    );

    res.json(updatedCompany);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
