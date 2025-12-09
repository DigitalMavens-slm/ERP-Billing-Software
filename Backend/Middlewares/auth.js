
const jwt = require("jsonwebtoken");
// const JWT_SECRET=process.env.JWT_SECRET
// console.log("AUTH VERIFY FILE",JWT_SECRET)
module.exports = (req, res, next) => {
  try {
    
    const token =
      req.cookies["token"] ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log(token)
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
