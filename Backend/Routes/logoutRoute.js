// logoutRoute.js
const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd, 
    sameSite: isProd ? "None" : "Lax",
    path: "/",
  });

  return res.json({ message: "Logged out successfully" });
});

module.exports = router;
