// const express = require("express");
// const router = express.Router();
// const {getPaymentSummary} = require("../Controller/ReportsController");
//   // getCompareReport,

// // router.get("/reports/compare", getCompareReport);
// router.get("/reports/payment-summary", getPaymentSummary);

// module.exports = router;


const express = require("express");
const { getReports } = require("../Controller/ReportsController");
const router = express.Router();

// GET /api/reports
router.get("/reports", getReports);
router.get("/reports/compare", getReports);

module.exports = router;
