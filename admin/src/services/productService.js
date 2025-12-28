// src/services/productService.js
import axios from "../utils/axiosInstance.js";

export const createProduct = async (formData) => {
  return axios.post("/api/admin/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get all products
export const getProducts = async (params = {}) => {
  return axios.get("/api/admin/products", { params });
};

// Get product by ID
export const getProductById = async (id) => {
  return axios.get(`/api/admin/products/${id}`);
};

// Update product
export const updateProduct = async (id, formData) => {
  return axios.put(`/api/admin/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete product
export const deleteProduct = async (id) => {
  return axios.delete(`/api/admin/products/${id}`);
};

// Update product status
export const updateProductStatus = async (id, status) => {
  return axios.patch(`/api/admin/products/${id}/status`, {
    status,
  });
};

// Toggle featured status
export const toggleFeatured = async (id) => {
  return axios.patch(`/api/admin/products/${id}/toggle-featured`);
};

// Bulk delete products
export const bulkDeleteProducts = async (ids) => {
  return axios.post("/api/admin/products/bulk-delete", {
    ids,
  });
};

// Bulk update products
export const bulkUpdateProducts = async (ids, data) => {
  return axios.post("/api/admin/products/bulk-update", {
    ids,
    data,
  });
};
