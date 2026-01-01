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

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure token payload contains the admin id
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

    // Ensure admin has required role
    if (admin.role !== "MainAdmin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    // Clear admin cookie using the same options used when setting it
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
