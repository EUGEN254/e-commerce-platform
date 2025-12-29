// src/services/categoryService.js
import axios from "../utils/axiosInstance.js";

const categoryService = {
  // Create category with image uploads
  createCategory: async (formData) => {
    try {
      const response = await axios.post("/api/admin/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all categories
  getAllCategories: async (params = {}) => {
    try {
      const response = await axios.get("/api/admin/categories", {
        params,
      });
      console.log("Fetched categories:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single category
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`/api/admin/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update category
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
      throw error.response?.data || error.message;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`/api/admin/categories/delete-category/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update category status
  updateCategoryStatus: async (id, updates) => {
    try {
      const response = await axios.patch(
        `/api/admin/categories/${id}/status`,
        updates
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get category statistics
  getCategoryStats: async () => {
    try {
      const response = await axios.get("/api/admin/categories/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk update categories
  bulkUpdateCategories: async (categoryIds, updates) => {
    try {
      const response = await axios.patch("/api/admin/categories/bulk-update", {
        categoryIds,
        updates,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk delete categories
  bulkDeleteCategories: async (categoryIds) => {
    try {
      const response = await axios.delete("/api/admin/categories/bulk-delete", {
        data: { categoryIds },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update category order
  updateCategoryOrder: async (categoryId, updates) => {
    try {
      const response = await axios.patch(
        `/api/admin/categories/${categoryId}/order`,
        updates
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get products count by category
  getProductsCountByCategory: async (categoryId) => {
    try {
      const response = await axios.get(
        `/api/admin/categories/${categoryId}/products-count`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all categories with products count
  getAllCategoriesWithProducts: async (params = {}) => {
    try {
      const response = await axios.get("/api/admin/categories/with-products", {
        params: { ...params, includeProductsCount: true },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProductsCountForAllCategories: async () => {
    try {
      const response = await axios.get("/api/admin/categories/products-count/all");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default categoryService;
