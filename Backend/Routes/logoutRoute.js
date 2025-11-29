// logoutRoute.js
const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  res.clearCookie("auth-token", {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax",
    path: "/",
  });

  return res.json({ message: "Logged out successfully" });
});

module.exports = router;
