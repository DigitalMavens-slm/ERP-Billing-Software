const Company = require("../Model/CompanysettingModel"); // correct import
// const Company = require("../Model/CompanysettingModel");
const User = require("../Model/userModel"); // correct import



exports.createCompanySettings = async (req, res) => {
  try {
    const data = req.body;
    console.log("Incoming data:", data);

    // Handle file uploads safely
    if (req.files) {
      if (req.files.logoUrl) data.logoUrl = req.files.logoUrl[0].path;

      if (req.files.paymentUrl) data.paymentUrl = req.files.paymentUrl[0].path;

      if (req.files.extraPaymentUrl)
        data.extraPaymentUrl = req.files.extraPaymentUrl[0].path;
    }

    // Create the company
    const newCompany = await Company.create(data);

    // Assign company to the logged-in user
    await User.findByIdAndUpdate(req.user, {
      companyId: newCompany._id
    });

    res.status(201).json(newCompany);
  } catch (err) {
    console.error("Company creation error:", err);
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
