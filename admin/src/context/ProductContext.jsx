// src/context/ProductContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import {
  getProducts,
  getProductById,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  updateProductStatus,
  toggleFeatured as toggleFeaturedService,
  bulkDeleteProducts,
  bulkUpdateProducts,
} from "../services/productService.js";
import categoryService from "../services/categoryService.js";
import {
  getCache,
  setCache,
  removeCache,
} from "../utils/cache.js";
import { getErrorMessage } from "../utils/errorHandler.js";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formattedCategories, setFormattedCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesCountLoading, setCategoriesCountLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [stats, setStats] = useState({
    totalCategories: 0,
    totalProducts: 0,
    featuredCategories: 0,
    activeCategories: 0,
  });

  const curreSymbol = "KES";

  // Helper function to calculate stats from categories
  const calculateStatsFromCategories = useCallback((categoriesList = categories) => {
    if (categoriesList.length === 0) {
      return {
        totalCategories: 0,
        totalProducts: 0,
        featuredCategories: 0,
        activeCategories: 0
      };
    }
    
    const totalCategories = categoriesList.length;
    const activeCategories = categoriesList.filter(cat => cat.isActive).length;
    const featuredCategories = categoriesList.filter(cat => cat.featured).length;
    
    // Sum up products from all categories
    const totalProducts = categoriesList.reduce((sum, cat) => 
      sum + (cat.totalProducts || 0), 0
    );
    
    return {
      totalCategories,
      totalProducts,
      activeCategories,
      featuredCategories
    };
  }, [categories]);

  // Update stats whenever categories change
  useEffect(() => {
    const newStats = calculateStatsFromCategories();
    setStats(newStats);
  }, [categories, calculateStatsFromCategories]);

  // Fetch all products with filters
  const fetchProducts = useCallback(async (params = {}) => {
    // Create cache key from params
    const cacheKey = `products_${JSON.stringify(params)}`;
    
    // Check if we have cached data (skip cache if explicitly requested)
    if (!params.skipCache) {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        setProducts(cachedData.data);
        setPagination(cachedData.pagination);
        return {
          success: true,
          data: cachedData.data,
          pagination: cachedData.pagination,
          message: "Data from cache",
          isCache: true,
        };
      }
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(params);
      
      // The API returns { success, data, pagination } structure
      const responseData = response.data;

      // Set products - check different possible structures
      let productsData = [];
      if (responseData.data && Array.isArray(responseData.data)) {
        productsData = responseData.data;
      } else if (Array.isArray(responseData)) {
        productsData = responseData;
      }

      // Set pagination
      const paginationData = responseData.pagination || {
        page: params.page || 1,
        limit: params.limit || 10,
        total: productsData.length,
        pages: Math.ceil(productsData.length / (params.limit || 10)),
      };

      setProducts(productsData);
      setPagination(paginationData);

      // Cache the results (5 minutes)
      setCache(
        cacheKey,
        { data: productsData, pagination: paginationData },
        5 * 60 * 1000
      );

      return {
        success: true,
        data: productsData,
        pagination: paginationData,
        message: responseData.message,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error) || "Failed to fetch products";
      console.error("Error in fetchProducts:", errorMessage, error);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single product by ID
  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductById(id);
      const responseData = response.data;

      setProduct(responseData.data);
      return {
        success: true,
        data: responseData.data,
        message: responseData.message,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error) || "Failed to fetch product details";
      console.error("Error in fetchProductById:", errorMessage, error);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a product
  const createProduct = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createProductService(formData);
      const responseData = response.data;

      toast.success(responseData.message || "Product created successfully!");

      // Add to local state if successful
      if (responseData.success && responseData.data) {
        setProducts((prev) => [responseData.data, ...prev]);
      }

      return {
        success: responseData.success || true,
        data: responseData.data,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error in createProduct:", error);
      const errorMessage = getErrorMessage(error) || "Failed to create product";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update a product
  const updateProduct = async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateProductService(id, formData);
      const responseData = response.data;

      toast.success(responseData.message || "Product updated successfully!");

      // Update in local state
      if (responseData.success && responseData.data) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, ...responseData.data } : p))
        );
        if (product && product._id === id) {
          setProduct(responseData.data);
        }
      }

      return {
        success: responseData.success || true,
        data: responseData.data,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error in updateProduct:", error);
      const errorMessage = getErrorMessage(error) || "Failed to update product";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteProductService(id);
      const responseData = response.data;

      toast.success(responseData.message || "Product deleted successfully!");

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (product && product._id === id) {
        setProduct(null);
      }

      // Invalidate product cache
      removeCache("products_all");
      // Clear all product-related caches
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("app_cache_products_")) {
          localStorage.removeItem(key);
        }
      });

      return {
        success: responseData.success || true,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      const errorMessage = getErrorMessage(error) || "Failed to delete product";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update product status
  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      const response = await updateProductStatus(id, status);
      const responseData = response.data;

      toast.success(responseData.message || "Status updated successfully!");

      // Update in local state
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p))
      );
      if (product && product._id === id) {
        setProduct((prev) => ({ ...prev, status }));
      }

      return {
        success: responseData.success || true,
        data: responseData.data,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error in updateStatus:", error);
      const errorMessage = getErrorMessage(error) || "Failed to update status";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id) => {
    setLoading(true);
    try {
      const response = await toggleFeaturedService(id);
      const responseData = response.data;

      // Update in local state
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isFeatured: responseData.data?.isFeatured } : p
        )
      );
      if (product && product._id === id) {
        setProduct((prev) => ({
          ...prev,
          isFeatured: responseData.data?.isFeatured,
        }));
      }

      toast.success(
        responseData.data?.isFeatured
          ? "Product marked as featured!"
          : "Product removed from featured!"
      );

      return {
        success: responseData.success || true,
        data: responseData.data,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error in toggleFeatured:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to toggle featured";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete products
  const bulkDelete = async (ids) => {
    setLoading(true);
    try {
      const response = await bulkDeleteProducts(ids);
      const responseData = response.data;

      toast.success(responseData.message || "Products deleted successfully!");

      // Remove from local state
      setProducts((prev) => prev.filter((p) => !ids.includes(p._id)));

      // Invalidate product cache
      removeCache("products_all");
      // Clear all product-related caches
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("app_cache_products_")) {
          localStorage.removeItem(key);
        }
      });

      return {
        success: responseData.success || true,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error in bulkDelete:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete products";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for product form dropdowns
  const fetchCategories = useCallback(async (skipCache = false) => {
    const cacheKey = "categories_active";
    
    // Check cache first
    if (!skipCache) {
      const cachedCategories = getCache(cacheKey);
      if (cachedCategories) {
        setCategories(cachedCategories);
        return {
          success: true,
          data: cachedCategories,
          message: "Data from cache",
          isCache: true,
        };
      }
    }

    setCategoriesLoading(true);
    try {
      const response = await categoryService.getAllCategories({
        isActive: true,
        sortBy: "name",
        sortOrder: "asc",
        limit: 100,
      });

      // Normalize response whether service returned axios.response.data or direct data
      const responseData = response?.data || response;
      const categoriesData = Array.isArray(responseData)
        ? responseData
        : responseData?.data || [];

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      // Cache categories (10 minutes)
      if (Array.isArray(categoriesData)) {
        setCache(cacheKey, categoriesData, 10 * 60 * 1000);
      }

      return {
        success: true,
        data: categoriesData,
        message: responseData?.message || response?.message,
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load categories";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Get formatted categories for dropdowns (with grouping by type)
  const getFormattedCategories = useCallback(() => {
    if (!categories.length) return [];

    // Group categories by type for better organization
    const groupedByType = categories.reduce((acc, category) => {
      const type = category.type || "Uncategorized";
      if (!acc[type]) {
        acc[type] = [];
      }

      const categoryOption = {
        value: category.id || category._id,
        label: category.name,
        icon: category.icon,
        subcategories: category.subcategoriesDetailed || [],
        totalProducts: category.totalProducts || 0,
        path: category.path,
      };

      // If category has subcategories, add them as options too
      if (
        category.subcategoriesDetailed &&
        category.subcategoriesDetailed.length > 0
      ) {
        categoryOption.subcategoryOptions = category.subcategoriesDetailed.map(
          (subcat) => ({
            value: `${category.id}/${subcat.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            label: `${category.name} - ${subcat.name}`,
            icon: category.icon,
            parentCategory: category.name,
            totalProducts: subcat.totalProducts || 0,
          })
        );
      }

      acc[type].push(categoryOption);
      return acc;
    }, {});

    return groupedByType;
  }, [categories]);

  // Get category by ID
  const getCategoryById = useCallback(
    (categoryId) => {
      return (
        categories.find(
          (cat) => cat.id === categoryId || cat._id === categoryId
        ) || null
      );
    },
    [categories]
  );

  // Get categories for select input
  const getCategoriesForSelect = useCallback(() => {
    return formattedCategories.map((cat) => ({
      value: cat.value,
      label: cat.label,
      icon: cat.icon,
    }));
  }, [formattedCategories]);

  // Get subcategories for a specific category
  const getSubcategories = useCallback(
    (categoryId) => {
      const category = categories.find(
        (cat) => cat.id === categoryId || cat._id === categoryId
      );

      if (!category || !category.subcategoriesDetailed) return [];

      return category.subcategoriesDetailed.map((subcat) => ({
        value: subcat.name.toLowerCase().replace(/\s+/g, "-"),
        label: subcat.name,
        description: subcat.description,
        totalProducts: subcat.totalProducts || 0,
      }));
    },
    [categories]
  );

  // Update category status
  const updateCategoryStatus = async (categoryId, isActive) => {
    setCategoriesLoading(true);
    try {
      const response = await categoryService.updateCategoryStatus(categoryId, {
        isActive,
      });
      const responseData = response.data || response;

      // Update in local state
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === categoryId
            ? { ...cat, isActive: responseData.data?.isActive || isActive }
            : cat
        )
      );

      // Stats will update automatically via useEffect

      toast.success(responseData.message || "Category status updated");

      return {
        success: true,
        data: responseData.data,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error updating category status:", error);
      const errorMessage = error.message || "Failed to update category status";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Update category featured status
  const updateCategoryFeatured = async (categoryId, featured) => {
    setCategoriesLoading(true);
    try {
      const response = await categoryService.updateCategoryStatus(categoryId, {
        featured,
      });
      const responseData = response.data || response;

      // Update in local state
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === categoryId
            ? { ...cat, featured: responseData.data?.featured || featured }
            : cat
        )
      );

      // Stats will update automatically via useEffect

      toast.success(responseData.message || "Category featured status updated");

      return {
        success: true,
        data: responseData.data,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error updating category featured:", error);
      const errorMessage =
        error.message || "Failed to update category featured status";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (categoryId) => {
    setCategoriesLoading(true);
    try {
      const response = await categoryService.deleteCategory(categoryId);
      const responseData = response.data || response;

      // Remove from local state
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));

      // Stats will update automatically via useEffect

      toast.success(responseData.message || "Category deleted successfully");

      return {
        success: true,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error deleting category:", error);
      const errorMessage = error.message || "Failed to delete category";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Bulk update categories
  const bulkUpdateCategories = async (categoryIds, updates) => {
    setCategoriesLoading(true);
    try {
      const response = await categoryService.bulkUpdateCategories(
        categoryIds,
        updates
      );
      const responseData = response.data || response;

      // Update in local state
      setCategories((prev) =>
        prev.map((cat) =>
          categoryIds.includes(cat._id) ? { ...cat, ...updates } : cat
        )
      );

 

      toast.success(responseData.message || "Categories updated successfully");

      return {
        success: true,
        data: responseData.data,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error bulk updating categories:", error);
      const errorMessage = error.message || "Failed to update categories";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Bulk delete categories
  const bulkDeleteCategories = async (categoryIds) => {
    setCategoriesLoading(true);
    try {
      const response = await categoryService.bulkDeleteCategories(categoryIds);
      const responseData = response.data || response;

      // Remove from local state
      setCategories((prev) =>
        prev.filter((cat) => !categoryIds.includes(cat._id))
      );

      // Stats will update automatically via useEffect

      toast.success(responseData.message || "Categories deleted successfully");

      // Invalidate category cache
      removeCache("categories_active");
      // Clear all category-related caches
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("app_cache_categor")) {
          localStorage.removeItem(key);
        }
      });

      return {
        success: true,
        message: responseData.message,
      };
    } catch (error) {
      console.error("Error bulk deleting categories:", error);
      const errorMessage = error.message || "Failed to delete categories";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCategoriesLoading(false);
    }
  };


  // Get products count by category
  const getProductsCountByCategory = async (categoryId) => {
    try {
      const response = await categoryService.getProductsCountByCategory(
        categoryId
      );
      const responseData = response.data || response;

      // Update the specific category's product count
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === categoryId
            ? { ...cat, totalProducts: responseData.count || 0 }
            : cat
        )
      );

      return {
        success: true,
        count: responseData.count,
        data: responseData.data,
      };
    } catch (error) {
      console.error("Error getting products count:", error);
      return { success: false, error: error.message };
    }
  };

  // Update all categories products count
  const updateAllCategoriesProductCount = async () => {
    try {
      // Fetch all categories with their product counts
      const response = await categoryService.getAllCategoriesWithProducts();
      const responseData = response?.data || response;
      const categoriesData = Array.isArray(responseData)
        ? responseData
        : responseData?.data || [];

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      return {
        success: true,
        data: categoriesData,
      };
    } catch (error) {
      console.error("Error updating categories product count:", error);
      return { success: false, error: error.message };
    }
  };

  // Get products count for all categories
const fetchProductsCountForCategories = async () => {
  setCategoriesCountLoading(true);
  try {
    const response = await categoryService.getProductsCountForAllCategories();

    if (response && response.success === false) {
      throw new Error(response.message || "Failed to fetch product counts");
    }

    const categoriesData = response.data || [];

    // Merge returned counts into existing categories state instead of replacing
    if (categoriesData.length > 0) {
      setCategories((prevCategories) => {
        // Build lookup map from returned data by _id and id
        const countsById = new Map();
        categoriesData.forEach((c) => {
          const key = c._id || c.id;
          countsById.set(String(key), c.totalProducts || 0);
        });

        // Merge counts into previous categories, preserving other fields
        const merged = prevCategories.map((pc) => {
          const key = pc._id || pc.id;
          if (countsById.has(String(key))) {
            return { ...pc, totalProducts: countsById.get(String(key)) };
          }
          return pc;
        });

        // For any returned category not present in prevCategories, add it
        const prevKeys = new Set(merged.map((c) => String(c._id || c.id)));
        categoriesData.forEach((c) => {
          const key = String(c._id || c.id);
          if (!prevKeys.has(key)) {
            merged.push({
              ...c,
              id: c._id || c.id,
              isActive: c.isActive !== undefined ? c.isActive : true,
              featured: c.featured || false,
              totalProducts: c.totalProducts || 0,
            });
          }
        });

        // Recalculate stats based on merged categories
        const newStats = calculateStatsFromCategories(merged);
        setStats(newStats);

        return merged;
      });
    }

    return {
      success: true,
      data: categoriesData,
      message: response.message || "Product counts fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching products count for categories:", error);
    const errorMessage = error.message || "Failed to fetch product counts";
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setCategoriesCountLoading(false);
  }
};
// Add this function to your ProductContext
const getProductsByCategory = useCallback(async (categoryId, params = {}) => {
  setLoading(true);
  try {
    // Fetch products with category filter
    const response = await getProducts({ category: categoryId, ...params });
    const responseData = response.data;

    // The API returns { success, data, pagination } structure
    const productsData = responseData.data || [];
    
    return productsData;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch products";
    toast.error(errorMessage);
    return [];
  } finally {
    setLoading(false);
  }
}, []);

  // Clear product state
  const clearProduct = () => {
    setProduct(null);
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const value = {
    products,
    product,
    loading,
    error,
    categories,
    formattedCategories,
    categoriesLoading,
    categoriesCountLoading,
    pagination,
    curreSymbol,
    // Product operations
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStatus,
    toggleFeatured,
    bulkDelete,
    clearProduct,
    clearError,
    // Category operations
    fetchCategories,
    getFormattedCategories,
    getCategoryById,
    getCategoriesForSelect,
    getSubcategories,
    stats,
    updateCategoryStatus,
    updateCategoryFeatured,
    deleteCategory,
    bulkUpdateCategories,
    bulkDeleteCategories,
    // updateCategoryOrder removed
    getProductsCountByCategory,
    updateAllCategoriesProductCount,
    fetchProductsCountForCategories,
    getProductsByCategory,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};