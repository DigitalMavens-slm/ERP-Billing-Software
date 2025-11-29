const express = require("express");
const router = express.Router();
const { checkAuth } = require("../Controller/checkAuth");
const auth = require("../Middlewares/auth");

router.get("/check-auth", auth, checkAuth);

module.exports = router;
