import axios from "../utils/axiosInstance.js";
import { getErrorMessage, logError } from "../utils/errorHandler.js";

/**
 * Request admin login
 * @param {object} data - Login credentials {email, password}
 * @returns {Promise<object>} - Response with admin data and token
 * @throws {Error} - With user-friendly message
 */
export const loginAdminRequest = (data) => {
  try {
    return axios.post("/api/admin/login", data);
  } catch (error) {
    logError("loginAdminRequest", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Request admin logout
 * @returns {Promise<object>} - Response from server
 * @throws {Error} - With user-friendly message
 */
export const logoutAdminRequest = () => {
  try {
    return axios.post("/api/admin/logout");
  } catch (error) {
    logError("logoutAdminRequest", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get admin profile
 * @returns {Promise<object>} - Admin profile data
 * @throws {Error} - With user-friendly message
 */
export const getAdminProfile = () => {
  try {
    return axios.get("/api/admin/details");
  } catch (error) {
    logError("getAdminProfile", error);
    throw new Error(getErrorMessage(error));
  }
};
