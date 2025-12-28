import axios from "../utils/axiosInstance.js";

export const loginAdminRequest = (data) => {
  return axios.post("/api/admin/login", data);
};

export const logoutAdminRequest = () => {
  return axios.post("/api/admin/logout");
};

export const getAdminProfile = () => {
  return axios.get("/api/admin/details");
};
