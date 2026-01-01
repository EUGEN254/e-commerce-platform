import axiosInstance from "../utils/axiosInstance";
import { getErrorMessage, logError } from "../utils/errorHandler.js";

/**
 * Get all users with optional filters
 * @param {object} params - Query parameters
 * @returns {Promise<object>} - Array of users with pagination
 * @throws {Error} - With user-friendly message
 */
const getUsers = (params = {}) => {
  try {
    return axiosInstance.get("/api/admin/users", { params });
  } catch (error) {
    logError("getUsers", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get single user by ID
 * @param {string} id - User ID
 * @returns {Promise<object>} - User details
 * @throws {Error} - With user-friendly message
 */
const getUserById = (id) => {
  try {
    return axiosInstance.get(`/api/admin/users/${id}`);
  } catch (error) {
    logError("getUserById", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Update a user
 * @param {string} id - User ID
 * @param {object} data - Data to update
 * @returns {Promise<object>} - Updated user
 * @throws {Error} - With user-friendly message
 */
const updateUser = (id, data) => {
  try {
    return axiosInstance.patch(`/api/admin/users/${id}`, data);
  } catch (error) {
    logError("updateUser", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise<object>} - Response from server
 * @throws {Error} - With user-friendly message
 */
const deleteUser = (id) => {
  try {
    return axiosInstance.delete(`/api/admin/users/${id}`);
  } catch (error) {
    logError("deleteUser", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Create a new user
 * @param {object} data - User data
 * @returns {Promise<object>} - Created user
 * @throws {Error} - With user-friendly message
 */
const createUser = (data) => {
  try {
    return axiosInstance.post('/api/admin/users', data);
  } catch (error) {
    logError("createUser", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get user activity history
 * @param {string} id - User ID
 * @returns {Promise<object>} - User activity
 * @throws {Error} - With user-friendly message
 */
const getUserActivity = (id) => {
  try {
    return axiosInstance.get(`/api/admin/users/${id}/activity`);
  } catch (error) {
    logError("getUserActivity", error);
    throw new Error(getErrorMessage(error));
  }
};

export { getUsers, getUserById, updateUser, deleteUser, createUser, getUserActivity };
