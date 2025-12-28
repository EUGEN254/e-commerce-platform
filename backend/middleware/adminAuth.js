import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const AdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;

    // 401 — Unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate payload
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Fetch admin from DB
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Optional role check 
    if (admin.role !== "MainAdmin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    // Clear cookie with SAME options used when setting
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    // 401 — Unauthorized
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

export default AdminAuth;
