import jwt from "jsonwebtoken";
import User from "../models/user.js"; // ✅ fixed extension

export const protectroute = async (req, res, next) => { // ✅ fixed order
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // optionally attach user to req
    next(); // ✅ continue to next middleware/handler
  } catch (error) {
    console.log("Error in protectroute middleware:", error);
    return res.status(500).json({ message: "Server error in authentication" });
  }
};
