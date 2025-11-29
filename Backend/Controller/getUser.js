const Company = require("../Model/CompanysettingModel"); // correct import
const User = require("../Model/userModel"); // correct import

exports.getUser = async (req, res) => {
  const user = await User.findById(req.user);
  let company = null;
  if (user.companyId) {
    company = await Company.findById(user.companyId);
  }
  res.json({ user, company });
};
