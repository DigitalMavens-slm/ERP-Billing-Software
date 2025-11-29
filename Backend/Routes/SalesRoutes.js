const express = require("express");
const router = express.Router();
const { getOrders, addOrder, deleteOrder, searchField } = require("../Controller/SalesController");

// Get all orders
router.get("/orders", getOrders);

// Add new order
router.post("/orders", addOrder);


router.delete("/orders/:id", deleteOrder);
router.get("/orders/searchField",searchField)

module.exports = router;
