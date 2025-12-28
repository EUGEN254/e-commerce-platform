import bcrypt from "bcrypt";
import Admin from "../../models/Admin.js";
import generateToken from "../../utils/generateTokenForAdmin.js";

const loginAdmin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 400 — Bad Request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // 401 — Unauthorized (generic message)
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate minimal JWT payload
    const token = generateToken(
      { id: admin._id, role: admin.role },
      rememberMe
    );

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : 24 * 60 * 60 * 1000,   // 1 day
    };

    // Set cookie
    res.cookie("adminToken", token, cookieOptions);

    // Remove password safely
    const adminData = admin.toObject();
    delete adminData.password;

    // 200 — OK
    return res.status(200).json({
      success: true,
      message: "Login successful",
      adminData,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    // 500 — Internal Server Error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc    Admin Logout
 * @route   POST /api/admin/logout
 * @access  Private
 */
const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    // 200 — OK
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Admin logout error:", error);

    // 500 — Internal Server Error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc    Get Admin Details
 * @route   GET /api/admin/me
 * @access  Private
 */
const getAdminDetails = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) {
      // 401 — Unauthorized
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // 200 — OK
    return res.status(200).json({
      success: true,
      adminData: admin,
    });
  } catch (error) {
    console.error("Get admin details error:", error);

    // 500 — Internal Server Error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { loginAdmin, logoutAdmin, getAdminDetails };
