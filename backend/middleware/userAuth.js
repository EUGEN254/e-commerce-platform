import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorised login again",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure token payload includes required fields
    if (!decode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // If token indicates the account is not verified, reject the request
    if (decode.isVerified === false) {
      res.clearCookie("token");
      return res.status(403).json({
        success: false,
        message: "Please verify your email",
        requiresVerification: true
      });
    }

    // fetch user from db and attach to req.user
    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Double check user is verified in database
    if (!user.isVerified) {
      res.clearCookie("token");
      return res.status(403).json({
        success: false,
        message: "Please verify your email to access your account",
        requiresVerification: true,
        email: user.email
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({
      success: false,
      message: error.message || "Not Authorised",
    });
  }
};

export default userAuth;