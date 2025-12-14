
const jwt = require("jsonwebtoken");
const User=require("../Model/userModel")
module.exports = async (req, res, next) => {
  try {
    

    const token =
      req.cookies["token"] ||
      req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    console.log(token)

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // req.user = decoded.id;
    req.user=user

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
