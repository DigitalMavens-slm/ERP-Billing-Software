const Finance = require("../Model/FinanceModel");

// 🟢 GET all finance records
exports.getFinanceRecords = async (req, res) => {
  try {
    const records = await Finance.find().sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 ADD new record
exports.addFinanceRecord = async (req, res) => {
  try {
    const newRecord = new Finance(req.body);
    const savedRecord = await newRecord.save();
    res.json(savedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🟢 DELETE record
exports.deleteFinanceRecord = async (req, res) => {
  try {
    const deleted = await Finance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 UPDATE record (optional)
exports.updateFinanceRecord = async (req, res) => {
  try {
    const updated = await Finance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Record not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
