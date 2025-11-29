const Customer = require("../Model/CustomerModel");

// GET all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching customers" });
  }
};

// POST create customer
exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating customer" });
  }
};

// DELETE customer by id
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting customer" });
  }
};
