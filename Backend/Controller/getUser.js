const Company = require("../Model/CompanysettingModel"); // correct import
const User = require("../Model/userModel"); // correct import
const bcrypt = require("bcryptjs");

exports.getUser = async (req, res) => {
  const user = await User.findById(req.user);
  let company = null;
  if (user.companyId) {
    company = await Company.findById(user.companyId);
  }
  res.json({ user, company });
};


/* GET users by role and company */
exports.getUsers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Important: restrict to logged-in user's company
    filter.companyId = req.companyId;

    const users = await User.find(filter).select("-password");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* CREATE STAFF USER */
exports.createStaff = async (req, res) => {
  try {
    console.log(req.body);
    const adminCompanyId = req.companyId;

    if (!adminCompanyId) {
      return res.status(400).json({ message: "Admin has no company assigned" });
    }

    const { name, email, password, mobile } = req.body;
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "staff",
      companyId: adminCompanyId,
    });

    res.status(201).json({
      message: "Staff created successfully",
      staff,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

