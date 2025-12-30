import axiosInstance from "../utils/axiosInstance";

const getUsers = (params = {}) => {
  return axiosInstance.get("/api/admin/users", { params });
};

const getUserById = (id) => {
  return axiosInstance.get(`/api/admin/users/${id}`);
};

const updateUser = (id, data) => {
  return axiosInstance.patch(`/api/admin/users/${id}`, data);
};

const deleteUser = (id) => {
  return axiosInstance.delete(`/api/admin/users/${id}`);
};

const createUser = (data) => {
  return axiosInstance.post('/api/admin/users', data);
};

const getUserActivity = (id) => {
  return axiosInstance.get(`/api/admin/users/${id}/activity`);
};

export { getUsers, getUserById, updateUser, deleteUser, createUser, getUserActivity };
