import express from "express";
import {
  getAdminDetails,
  loginAdmin,
  logoutAdmin,
} from "../../controllers/admin/adminController.js";
import AdminAuth from "../../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);
adminRouter.get("/details", AdminAuth, getAdminDetails);

export default adminRouter;
