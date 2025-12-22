// const getFinancialYear = require("../Utills/getFinancialYear");

// module.exports = (req, res, next) => {
//     // console.log()
//     console.log("📌 FY HEADER:", req.headers["x-financial-year"]);
// console.log("✅ FINAL FY:", req.financialYear);
//   req.financialYear =
//     req.headers["x-financial-year"] || getFinancialYear();
//   next();
// };


const getFinancialYear = require("../Utills/getFinancialYear");

module.exports = (req, res, next) => {
  const headerFY = req.headers["x-financial-year"];
  const autoFY = getFinancialYear(); // ✅ FUNCTION CALL

  // console.log("📌 FY HEADER:", headerFY);
  // console.log("📌 FY AUTO  :", autoFY);

  req.financialYear = headerFY || autoFY;

  // console.log("✅ FINAL FY :", req.financialYear);
  next();
};
