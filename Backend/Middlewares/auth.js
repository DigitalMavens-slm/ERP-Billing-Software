const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token =
      req.cookies["auth-token"] ||
      req.header("Authorization")?.replace("Bearer ", "");

      
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
