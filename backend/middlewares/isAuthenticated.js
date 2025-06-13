import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🛡️ Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🧩 Decoded token:", decoded);

    if (!decoded || !decoded._id) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    req.id = decoded._id; // ✅ Corrected: using _id from token
    next();
  } catch (error) {
    console.error("❌ JWT verification error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
