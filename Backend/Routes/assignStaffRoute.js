const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const { assignStaff } = require("../Controller/assignStaffController");

router.post("/assign-staff", auth, assignStaff)


module.exports = router;