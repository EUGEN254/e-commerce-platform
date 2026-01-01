// src/services/dashboardService.js
import axios from "../utils/axiosInstance.js";
import { getErrorMessage, logError } from "../utils/errorHandler.js";

/**
 * Get dashboard statistics
 * @returns {Promise<object>} - Dashboard stats
 * @throws {Error} - With user-friendly message
 */
export const getDashboardStats = async () => {
  try {
    return await axios.get("/api/admin/dashboard/stats");
  } catch (error) {
    logError("getDashboardStats", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get recent user activities
 * @returns {Promise<object>} - Array of recent activities
 * @throws {Error} - With user-friendly message
 */
export const getRecentActivities = async () => {
  try {
    return await axios.get("/api/admin/dashboard/activities");
  } catch (error) {
    logError("getRecentActivities", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get sales data for specified time range
 * @param {string} timeRange - Time range (day, week, month, year)
 * @returns {Promise<object>} - Sales data with timestamps
 * @throws {Error} - With user-friendly message
 */
export const getSalesData = async (timeRange = 'month') => {
  try {
    return await axios.get(`/api/admin/dashboard/sales?range=${timeRange}`);
  } catch (error) {
    logError("getSalesData", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get category distribution data
 * @returns {Promise<object>} - Categories with product counts
 * @throws {Error} - With user-friendly message
 */
export const getCategoryDistribution = async () => {
  try {
    return await axios.get("/api/admin/dashboard/categories");
  } catch (error) {
    logError("getCategoryDistribution", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get recent orders for admin dashboard
 */
export const getRecentOrders = async () => {
  try {
    return await axios.get('/api/admin/dashboard/recent-orders');
  } catch (error) {
    logError('getRecentOrders', error);
    throw new Error(getErrorMessage(error));
  }
};