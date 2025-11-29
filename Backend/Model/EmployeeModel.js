const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  role: { type: String },
  department: { type: String },
  salary: { type: Number, default: 0 },
});

module.exports = mongoose.model("Employee", employeeSchema);
