const Supplier = require("../Model/SupplierModel");

// Create new supplier
exports.addSupplier = async (req, res) => {
  try {
    const supplierData = {
      ...req.body,
      companyId: req.companyId,
    };

    const supplier = new Supplier(supplierData);
    await supplier.save();
    res.status(201).json({ message: "Supplier created", supplier });
  } catch (err) {
    console.error("Add supplier error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ companyId: req.companyId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(suppliers);
  } catch (err) {
    console.error("Get suppliers error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {new: true,});
    res.json({ message: "Supplier updated", supplier });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
