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
const auth=require("../Middlewares/auth")
const companyCheck=require("../Middlewares/companyCheck")
// GET /api/reports
router.get("/reports", auth,companyCheck,getReports);
// router.get("/reports/compare", getReports);

module.exports = router;
