// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   try {
//     const token =
//       req.cookies["auth-token"] ||
//       req.header("Authorization")?.replace("Bearer ", "");

      
//     if (!token) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     const decoded = jwt.verify(token,JWT_SECRET);
//     req.user = decoded.id;
//     // console.log("authmidllware",req.user)
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };



const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // 🔥 Read cookie named "token" (NOT auth-token)
    const token =
      req.cookies["token"] ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
