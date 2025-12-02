const router = require("express").Router();
const { getInventory } = require("../Controller/InventoryController");
const auth = require("../Middlewares/auth");
const companyCheck = require("../Middlewares/companyCheck");

router.get("/allinventory",auth,companyCheck, getInventory);

module.exports = router;
