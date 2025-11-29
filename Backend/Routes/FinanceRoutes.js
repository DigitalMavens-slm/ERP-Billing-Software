const express = require("express");
const router = express.Router();
const {
  getFinanceRecords,
  addFinanceRecord,
  deleteFinanceRecord,
  updateFinanceRecord,
} = require("../Controller/FinanceController");

// Routes
router.get("/finance", getFinanceRecords);
router.post("/finance", addFinanceRecord);
router.delete("/finance/:id", deleteFinanceRecord);
router.put("/finance/:id", updateFinanceRecord); // optional update route

module.exports = router;
