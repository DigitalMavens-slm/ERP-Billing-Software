const router = require("express").Router();
const { getInventory } = require("../Controller/InventoryController");

router.get("/allinventory", getInventory);

module.exports = router;
