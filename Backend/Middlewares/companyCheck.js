const User = require("../Model/userModel");

module.exports = async (req, res, next) => {
  try {
  
    const user = await User.findById(req.user);
    // console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.companyId) {
      return res.status(400).json({
        message: "You must create a company before performing this action",
      });
    }

    req.companyId = user.companyId; // Attach companyId to request
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
