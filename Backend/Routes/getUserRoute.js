const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const { getUser } = require("../Controller/getUser");

router.get("/me", auth, getUser);

module.exports = router;