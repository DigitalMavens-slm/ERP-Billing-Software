const Employee = require("../Model/EmployeeModel");

// GET all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD new employee
exports.addEmployee = async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    const saved = await newEmp.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted", deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
