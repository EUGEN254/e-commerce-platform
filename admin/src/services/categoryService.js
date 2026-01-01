// src/services/categoryService.js
import axios from "../utils/axiosInstance.js";
import { getErrorMessage, logError } from "../utils/errorHandler.js";

const categoryService = {
  /**
   * Create a new category with image uploads
   * @param {FormData} formData - Category form data
   * @returns {Promise<object>} - Created category
   * @throws {Error} - With user-friendly message
   */
  createCategory: async (formData) => {
    try {
      const response = await axios.post("/api/admin/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      logError("createCategory", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all categories with optional filters
   * @param {object} params - Query parameters
   * @returns {Promise<object>} - Array of categories
   * @throws {Error} - With user-friendly message
   */
  getAllCategories: async (params = {}) => {
    try {
      const response = await axios.get("/api/admin/categories", {
        params,
      });
      return response.data;
    } catch (error) {
      logError("getAllCategories", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get single category by ID
   * @param {string} id - Category ID
   * @returns {Promise<object>} - Category details
   * @throws {Error} - With user-friendly message
   */
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`/api/admin/categories/${id}`);
      return response.data;
    } catch (error) {
      logError("getCategoryById", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update a category with image uploads
   * @param {string} id - Category ID
   * @param {FormData} formData - Updated category data
   * @returns {Promise<object>} - Updated category
   * @throws {Error} - With user-friendly message
   */
  updateCategory: async (id, formData) => {
    try {
      const response = await axios.put(
        `/api/admin/categories/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      logError("updateCategory", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {Promise<object>} - Response from server
   * @throws {Error} - With user-friendly message
   */
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`/api/admin/categories/delete-category/${id}`);
      return response.data;
    } catch (error) {
      logError("deleteCategory", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update category status (active/inactive, featured)
   * @param {string} id - Category ID
   * @param {object} updates - Status updates
   * @returns {Promise<object>} - Updated category
   * @throws {Error} - With user-friendly message
   */
  updateCategoryStatus: async (id, updates) => {
    try {
      const response = await axios.patch(
        `/api/admin/categories/${id}/status`,
        updates
      );
      return response.data;
    } catch (error) {
      logError("updateCategoryStatus", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get category statistics
   * @returns {Promise<object>} - Category stats
   * @throws {Error} - With user-friendly message
   */
  getCategoryStats: async () => {
    try {
      const response = await axios.get("/api/admin/categories/stats");
      return response.data;
    } catch (error) {
      logError("getCategoryStats", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update multiple categories at once
   * @param {string[]} categoryIds - Array of category IDs
   * @param {object} updates - Updates to apply
   * @returns {Promise<object>} - Response from server
   * @throws {Error} - With user-friendly message
   */
  bulkUpdateCategories: async (categoryIds, updates) => {
    try {
      const response = await axios.patch("/api/admin/categories/bulk-update", {
        categoryIds,
        updates,
      });
      return response.data;
    } catch (error) {
      logError("bulkUpdateCategories", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete multiple categories at once
   * @param {string[]} categoryIds - Array of category IDs
   * @returns {Promise<object>} - Response from server
   * @throws {Error} - With user-friendly message
   */
  bulkDeleteCategories: async (categoryIds) => {
    try {
      const response = await axios.delete("/api/admin/categories/bulk-delete", {
        data: { categoryIds },
      });
      return response.data;
    } catch (error) {
      logError("bulkDeleteCategories", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get product count for a specific category
   * @param {string} categoryId - Category ID
   * @returns {Promise<object>} - Product count
   * @throws {Error} - With user-friendly message
   */
  getProductsCountByCategory: async (categoryId) => {
    try {
      const response = await axios.get(
        `/api/admin/categories/${categoryId}/products-count`
      );
      return response.data;
    } catch (error) {
      logError("getProductsCountByCategory", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all categories with products count
   * @param {object} params - Query parameters
   * @returns {Promise<object>} - Categories with product counts
   * @throws {Error} - With user-friendly message
   */
  getAllCategoriesWithProducts: async (params = {}) => {
    try {
      const response = await axios.get("/api/admin/categories/with-products", {
        params: { ...params, includeProductsCount: true },
      });
      return response.data;
    } catch (error) {
      logError("getAllCategoriesWithProducts", error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get product counts for all categories
   * @returns {Promise<object>} - All categories with product counts
   * @throws {Error} - With user-friendly message
   */
  getProductsCountForAllCategories: async () => {
    try {
      const response = await axios.get("/api/admin/categories/products-count/all");
      return response.data;
    } catch (error) {
      logError("getProductsCountForAllCategories", error);
      throw new Error(getErrorMessage(error));
    }
  },
};

export default categoryService;
