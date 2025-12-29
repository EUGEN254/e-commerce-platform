import axios from "../utils/axiosInstance";

export const getUsers = (params = {}) => {
  return axios.get("/api/admin/users", { params });
};

export const getUserById = (id) => {
  return axios.get(`/api/admin/users/${id}`);
};

export const updateUser = (id, data) => {
  return axios.patch(`/api/admin/users/${id}`, data);
};

export const deleteUser = (id) => {
  return axios.delete(`/api/admin/users/${id}`);
};

export const createUser = (data) => {
  // Use public registration endpoint to create a user
  return axios.post('/api/auth/register', data);
};
