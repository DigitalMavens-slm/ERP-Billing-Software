const Company = require("../Model/CompanysettingModel"); // correct import
const User = require("../Model/userModel"); // correct import

exports.createCompanySettings = async (req, res) => {
  try {
    const userId = req.user; // Logged-in us

    const { companyName, address, gstNumber } = req.body;

    const logoUrl = req.files.logoUrl ? req.files.logoUrl[0].path : null;
    const paymentUrl = req.files.paymentUrl
      ? req.files.paymentUrl[0].path
      : null;
    const extraPaymentUrl = req.files.extraPaymentUrl
      ? req.files.extraPaymentUrl[0].path
      : null;

    // 1. Create company
    const company = await Company.create({
      companyName,
      address,
      gstNumber,
      logoUrl,
      paymentUrl,
      extraPaymentUrl,
    });

    // 2. Update the logged-in user's companyId
    await User.findByIdAndUpdate(
      userId,
      { companyId: company._id },
      { new: true }
    );

    return res.status(201).json({
      message: "Company settings created successfully",
      company,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.saveCompanySettings = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (req.files) {
      if (req.files.logoUrl) data.logoUrl = req.files.logoUrl[0].path;
      if (req.files.paymentUrl) data.paymentUrl = req.files.paymentUrl[0].path;
      if (req.files.extraPaymentUrl)
        data.extraPaymentUrl = req.files.extraPaymentUrl[0].path;
    }

    const updated = await Company.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET
exports.getCompanySettings = async (req, res) => {
  try {
    const settings = await Company.findOne();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
