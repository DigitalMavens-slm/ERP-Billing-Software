// logoutRoute.js
const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, 
    sameSite: "None",
    path: "/",
  });

  return res.json({ message: "Logged out successfully" });
});

module.exports = router;
