const mongoose = require("mongoose");
const Ledger = require("../Model/LedgerModel");
const Customer=require("../Model/CustomerModel")
const Supplier=require("../Model/SupplierModel")
const SupplierLedger=require("../Model/SupplierLedgerModel")


exports.getAllLedgers = async (req, res) => {
  try {
    const ledgers = await Ledger.find({
      companyId: req.companyId, // ✅ Correct filter
    }).populate("customerId", "name");

    res.status(200).json({ success: true, ledgers });
  } catch (err) {
    console.error("❌ Error fetching ledgers:", err);
    res.status(500).json({ success: false, error: "Failed to fetch ledgers" });
  }
};

exports.getCustomerSuggestions = async (req, res) => {
  try {
    const query = req.query.query || "";

    const customers = await Customer.find({
      companyId: req.companyId, // 🔥 Only your company’s customers
      name: { $regex: query, $options: "i" },
    })
      .limit(10)
      .select("name _id");

    res.json(customers);
  } catch (err) {
    console.error("❌ Suggestion error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      companyId: req.companyId, // 🔥 Important
    });

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json(customer);
  } catch (err) {
    console.error("❌ Get customer error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getCustomerLedger = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid customer ID" });
    }

    const entries = await Ledger.find({
      customerId: customerId,
      companyId: req.companyId, // 🔥 VERY IMPORTANT
    })
      .sort({ date: 1, createdAt: 1 })
      .lean();

    res.json({ success: true, ledger: entries });
  } catch (err) {
    console.error("❌ Ledger fetch error:", err);
    res.status(500).json({ success: false, message: "Ledger fetch failed" });
  }
};




exports.getAllSupplierLedgers = async (req, res) => {
  try {
    const ledgers = await SupplierLedger.find().populate("supplierId", "name");
    res.status(200).json({ ledgers });
  } catch (err) {
    console.error("❌ Error fetching supplier ledgers:", err);
    res.status(500).json({ error: "Failed to fetch ledgers" });
  }
};

// Supplier suggestions (search)
exports.getSupplierSuggestions = async (req, res) => {
  try {
    const q = (req.query.query || "").trim();
    if (!q) return res.json([]);

    // basic case-insensitive partial match on name
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const results = await Supplier.find({ companyId: req.companyId, name: { $regex: regex } })
      .select("_id name")
      .limit(10)
      .lean();

    res.json(results);
  } catch (err) {
    console.error("Supplier suggestions error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get single supplier info
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ _id: req.params.id, companyId: req.companyId }).lean();
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    console.error("Get supplier error:", err);
    res.status(500).json({ message: err.message });
  }
}

// Get supplier ledger by supplierId
exports.getSupplierLedger = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;

    if (!supplierId)
      return res.status(400).json({ message: "supplierId required" });
    const ledgerRows = await SupplierLedger.find({
      companyId: req.companyId, // 🔥 filter by company
      supplierId, // 🔥 filter by supplier
    })
      .sort({ date: 1, createdAt: 1 })
      .lean();

    res.json({ ledger: ledgerRows });
  } catch (err) {
    console.error("Get supplier ledger error:", err);
    res.status(500).json({ message: err.message });
  }
};
