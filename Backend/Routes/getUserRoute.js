const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const { getUser, createStaff, getUsers, } = require("../Controller/getUser");
const companyCheck = require("../Middlewares/companyCheck");

router.get("/me", auth, getUser);

router.get("/users", auth, companyCheck, getUsers);


/* Create new staff */
router.post("/create-staff", auth, companyCheck, createStaff);

module.exports = router;