const mongoose = require("mongoose");
const Ledger = require("../Model/LedgerModel");
const Customer=require("../Model/CustomerModel")
const Supplier=require("../Model/SupplierModel")
const SupplierLedger=require("../Model/SupplierLedgerModel")


                  // all customer ledger
exports.getAllLedgers = async (req, res) => {
  try {
    const ledgers = await Ledger.find().populate("customerId", "name");
    res.status(200).json({ ledgers });
  } catch (err) {
    console.error("❌ Error fetching ledgers:", err);
    res.status(500).json({ error: "Failed to fetch ledgers" });
  }
};


exports.getCustomerSuggestions= async (req,res)=>{
  try{
      const query=req.query.query
        const customers= await Customer.find({
           name: { $regex: query, $options: "i" },
        })
        .limit(10)
      .select("name _id"); // only name and ID

    res.json(customers);
  }
  catch(err){

  }
}


exports.getCustomer=async(req,res)=>{
  try{

    const customer= await Customer.findById(req.params.id)
    if (!customer) return res.status(404).json({ message: "Customer not found" });
  
     res.json(customer);
  }
  catch(err){
    console.error(err)
    res.status(500).json({ message: "Server error" });
  }
}

//             get   single customer ledger
exports.getCustomerLedger = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ success: false, message: "Invalid customer ID" });
    }

    const objectId = new mongoose.Types.ObjectId(customerId);

    // fetch ledger entries from Ledger collection (sorted)
    const entries = await Ledger.find({ customerId: objectId }).sort({ date: 1, createdAt: 1 }).lean();

    // format if needed (here entries already have debit/credit/balance)
    res.json({ success: true, ledger: entries });
  } catch (err) {
    console.error("❌ Ledger error:", err);
    res.status(500).json({ success: false, message: "Ledger fetch failed" });
  }
};


                                  //  supplier ledger             //  


// exports.getAllSupplierLedgers = async (req, res) => {
//   try {
//     const ledgers = await SupplierLedger.find()
//       .populate("supplierId", "supplierName");

//     res.status(200).json({ ledgers });
//   } catch (err) {
//     console.error("❌ Error fetching supplier ledgers:", err);
//     res.status(500).json({ error: "Failed to fetch ledgers" });
//   }
// };


// exports.getSupplierSuggestions = async (req, res) => {
//   try {
//     const query = req.query.query;
//   //  console.log(query)
//   //  if(!suppliers) return;
//     const suppliers = await Supplier.find({
//       name: { $regex: query, $options: "i" },
//     })
//       .limit(10)
//       .select("name _id");
// console.log(suppliers)
//     res.json(suppliers);
//   } catch (err) {
//     console.error("❌ Supplier search error:", err);
//     res.status(500).json([]);
//   }
// };


// exports.getSupplier = async (req, res) => {
//   try {
//     const supplier = await Supplier.findById(req.params.id);

//     if (!supplier)
//       return res.status(404).json({ message: "Supplier not found" });

//     res.json(supplier);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// exports.getSupplierLedger = async (req, res) => {
//   try {
//     const { supplierId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(supplierId)) {
//       return res.status(400).json({ success: false, message: "Invalid supplier ID" });
//     }

//     const objectId = new mongoose.Types.ObjectId(supplierId);

//     // Fetch ledger entries sorted
//     const entries = await Ledger.find({ supplierId: objectId })
//       .sort({ date: 1, createdAt: 1 })
//       .lean();

//     res.json({ success: true, ledger: entries });
//   } catch (err) {
//     console.error("❌ Supplier Ledger error:", err);
//     res.status(500).json({ success: false, message: "Ledger fetch failed" });
//   }
// };




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
    const query = req.query.query || "";
    const suppliers = await Supplier.find({
      // your Supplier model has field `name`
      name: { $regex: query, $options: "i" },
    })
      .limit(10)
      .select("name _id");
    res.json(suppliers);
  } catch (err) {
    console.error("❌ Supplier search error:", err);
    res.status(500).json([]);
  }
};

// Get single supplier info
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get supplier ledger by supplierId
exports.getSupplierLedger = async (req, res) => {
  try {
    const { supplierId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ success: false, message: "Invalid supplier ID" });
    }
    const objectId = new mongoose.Types.ObjectId(supplierId);

    // Use SupplierLedger model (not customer Ledger)
    const entries = await SupplierLedger.find({ supplierId: objectId })
      .sort({ date: 1, createdAt: 1 })
      .lean();

    res.json({ success: true, ledger: entries });
  } catch (err) {
    console.error("❌ Supplier Ledger error:", err);
    res.status(500).json({ success: false, message: "Ledger fetch failed" });
  }
};