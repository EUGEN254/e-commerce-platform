// src/context/ProductContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  bulkUpdateProducts
} from "../services/productService.js";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const curreSymbol = "KES"

  // Fetch all products with filters
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(params);
      
      // The response from axios contains data in response.data
      // The API returns { success, data, pagination } structure
      const responseData = response.data;
      
      console.log("API Response:", responseData); // Debug log
      
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
        pages: Math.ceil(productsData.length / (params.limit || 10))
      };
      
      setProducts(productsData);
      setPagination(paginationData);
      
      return { 
        success: true, 
        data: productsData,
        pagination: paginationData,
        message: responseData.message
      };
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch products";
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
      return { success: true, data: responseData.data, message: responseData.message };
    } catch (error) {
      console.error("Error in fetchProductById:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch product details";
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
        setProducts(prev => [responseData.data, ...prev]);
      }
      
      return { 
        success: responseData.success || true, 
        data: responseData.data,
        message: responseData.message
      };
    } catch (error) {
      console.error("Error in createProduct:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create product";
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
        setProducts(prev => prev.map(p => 
          p._id === id ? { ...p, ...responseData.data } : p
        ));
        if (product && product._id === id) {
          setProduct(responseData.data);
        }
      }
      
      return { 
        success: responseData.success || true, 
        data: responseData.data,
        message: responseData.message
      };
    } catch (error) {
      console.error("Error in updateProduct:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update product";
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
      setProducts(prev => prev.filter(p => p._id !== id));
      if (product && product._id === id) {
        setProduct(null);
      }
      
      return { 
        success: responseData.success || true, 
        message: responseData.message 
      };
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete product";
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
      setProducts(prev => prev.map(p => 
        p._id === id ? { ...p, status } : p
      ));
      if (product && product._id === id) {
        setProduct(prev => ({ ...prev, status }));
      }
      
      return { 
        success: responseData.success || true, 
        data: responseData.data,
        message: responseData.message
      };
    } catch (error) {
      console.error("Error in updateStatus:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update status";
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
      setProducts(prev => prev.map(p => 
        p._id === id ? { ...p, isFeatured: responseData.data?.isFeatured } : p
      ));
      if (product && product._id === id) {
        setProduct(prev => ({ ...prev, isFeatured: responseData.data?.isFeatured }));
      }
      
      toast.success(
        responseData.data?.isFeatured 
          ? "Product marked as featured!" 
          : "Product removed from featured!"
      );
      
      return { 
        success: responseData.success || true, 
        data: responseData.data,
        message: responseData.message
      };
    } catch (error) {
      console.error("Error in toggleFeatured:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to toggle featured";
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
      setProducts(prev => prev.filter(p => !ids.includes(p._id)));
      
      return { 
        success: responseData.success || true, 
        message: responseData.message 
      };
    } catch (error) {
      console.error("Error in bulkDelete:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete products";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear product state
  const clearProduct = () => {
    setProduct(null);
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = {
    products,
    product,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStatus,
    curreSymbol,
    toggleFeatured,
    bulkDelete,
    clearProduct,
    clearError
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};