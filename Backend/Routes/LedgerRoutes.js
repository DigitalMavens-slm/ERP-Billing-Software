const express = require("express");
const router = express.Router();
const { getCustomerLedger ,getAllLedgers,getCustomerSuggestions,getCustomer,
    getSupplierLedger,getSupplierSuggestions,getSupplier, getAllSupplierLedgers
} = require("../Controller/LedgerController");

router.get("/ledger/:customerId", getCustomerLedger);
router.get("/ledger",getAllLedgers)

router.get("/suggest/customers",getCustomerSuggestions)
router.get("/customers/:id",getCustomer)


// router.get("/suppliers/id/:supplierId", getSupplierLedger);
// router.get("/suppliers/suggestions", getSupplierSuggestions);
// router.get("/suppliers/:id", getSupplier);


// router.get("/suppliers-ledgers", getAllSupplierLedgers);


router.get("/supplierledger/:supplierId", getSupplierLedger); // FRONTEND calls this
router.get("/suppliers/suggestions", getSupplierSuggestions);
router.get("/suppliers/:id", getSupplier);

router.get("/suppliers-ledgers", getAllSupplierLedgers)


module.exports = router;
