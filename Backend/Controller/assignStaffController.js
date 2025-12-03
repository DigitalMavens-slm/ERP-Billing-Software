
const User = require("../Model/userModel"); // correct import

exports.assignStaff = async (req, res) => {
  const { staffId, companyId } = req.body;



  if (!staffId || !companyId) {
    return res.status(400).json({ message: "Staff and company required" });
  }

  try {
    const staff = await User.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.companyId = companyId;
    await staff.save();

    res.json({ message: "Staff assigned to company", staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};