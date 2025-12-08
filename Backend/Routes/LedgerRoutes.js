const express = require("express");
const router = express.Router();
const { getCustomerLedger ,getAllLedgers,getCustomerSuggestions,getCustomer,
    getSupplierLedger,getSupplierSuggestions,getSupplier
} = require("../Controller/LedgerController");
const auth = require("../Middlewares/auth");
const companyCheck = require("../Middlewares/companyCheck");


router.get("/ledger/:customerId", auth, companyCheck, getCustomerLedger);
router.get("/ledger", auth, companyCheck, getAllLedgers);

router.get("/suggest/customers", auth, companyCheck, getCustomerSuggestions);

router.get("/customers/:id", auth, companyCheck, getCustomer);


router.get("/supplierledger/:supplierId", auth, companyCheck, getSupplierLedger); // FRONTEND calls this
router.get(
  "/suppliers/suggestions",
  auth,
  companyCheck,
  getSupplierSuggestions
);
router.get("/suppliers/:id", auth, companyCheck,  getSupplier);

// router.get("/suppliers-ledgers", getAllSupplierLedgers);


module.exports = router;
