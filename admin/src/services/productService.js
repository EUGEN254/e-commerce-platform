// src/services/productService.js
import axios from "../utils/axiosInstance.js";
import { getErrorMessage, logError } from "../utils/errorHandler.js";

/**
 * Create a new product
 * @param {FormData} formData - Product form data with file uploads
 * @returns {Promise<object>} - Response from server
 * @throws {Error} - With user-friendly message
 */
export const createProduct = async (formData) => {
  try {
    return await axios.post("/api/admin/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    logError("createProduct", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get all products with optional filters
 * @param {object} params - Query parameters (search, category, status, etc.)
 * @returns {Promise<object>} - Array of products with pagination
 * @throws {Error} - With user-friendly message
 */
export const getProducts = async (params = {}) => {
  try {
    return await axios.get("/api/admin/products", { params });
  } catch (error) {
    logError("getProducts", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Get single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<object>} - Product details
 * @throws {Error} - With user-friendly message
 */
export const getProductById = async (id) => {
  try {
    return await axios.get(`/api/admin/products/${id}`);
  } catch (error) {
    logError("getProductById", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {FormData} formData - Updated product data with possible file uploads
 * @returns {Promise<object>} - Updated product data
 * @throws {Error} - With user-friendly message
 */
export const updateProduct = async (id, formData) => {
  try {
    return await axios.put(`/api/admin/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    logError("updateProduct", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<object>} - Response from server
 * @throws {Error} - With user-friendly message
 */
export const deleteProduct = async (id) => {
  try {
    return await axios.delete(`/api/admin/products/${id}`);
  } catch (error) {
    logError("deleteProduct", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Update product status (active/inactive)
 * @param {string} id - Product ID
 * @param {string} status - New status (active/inactive)
 * @returns {Promise<object>} - Updated product
 * @throws {Error} - With user-friendly message
 */
export const updateProductStatus = async (id, status) => {
  try {
    return await axios.patch(`/api/admin/products/${id}/status`, {
      status,
    });
  } catch (error) {
    logError("updateProductStatus", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Toggle featured status of a product
 * @param {string} id - Product ID
 * @returns {Promise<object>} - Updated product
 * @throws {Error} - With user-friendly message
 */
export const toggleFeatured = async (id) => {
  try {
    return await axios.patch(`/api/admin/products/${id}/toggle-featured`);
  } catch (error) {
    logError("toggleFeatured", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Delete multiple products at once
 * @param {string[]} ids - Array of product IDs to delete
 * @returns {Promise<object>} - Response from server
 * @throws {Error} - With user-friendly message
 */
export const bulkDeleteProducts = async (ids) => {
  try {
    return await axios.post("/api/admin/products/bulk-delete", {
      ids,
    });
  } catch (error) {
    logError("bulkDeleteProducts", error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Update multiple products at once
 * @param {string[]} ids - Array of product IDs to update
 * @param {object} data - Data to update in each product
 * @returns {Promise<object>} - Response from server
 * @throws {Error} - With user-friendly message
 */
export const bulkUpdateProducts = async (ids, data) => {
  try {
    return await axios.post("/api/admin/products/bulk-update", {
      ids,
      data,
    });
  } catch (error) {
    logError("bulkUpdateProducts", error);
    throw new Error(getErrorMessage(error));
  }
};



