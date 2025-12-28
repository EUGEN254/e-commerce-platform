// src/services/dashboardService.js
import axios from "../utils/axiosInstance.js";

export const getDashboardStats = async () => {
  return axios.get("/api/admin/dashboard/stats");
};

export const getRecentActivities = async () => {
  return axios.get("/api/admin/dashboard/activities");
};

export const getSalesData = async (timeRange = 'month') => {
  return axios.get(`/api/admin/dashboard/sales?range=${timeRange}`);
};

export const getCategoryDistribution = async () => {
  return axios.get("/api/admin/dashboard/categories");
};