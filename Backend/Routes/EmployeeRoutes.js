const express = require("express");
const router = express.Router();
const {
  getEmployees,
  addEmployee,
  deleteEmployee,
} = require("../Controller/EmployeeController");

router.get("/employees", getEmployees);
router.post("/employees", addEmployee);
router.delete("/employees/:id", deleteEmployee);

module.exports = router;
