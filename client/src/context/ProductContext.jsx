// contexts/ProductContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Caching layer for expensive operations
  const cacheRef = useRef({
    byCategory: new Map(),
    bySubcategory: new Map(),
    bySearch: new Map(),
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch all products once
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/products`);
      setProducts(response.data.data || []);
      setError(null);

      // Clear category caches when all products update
      cacheRef.current.byCategory.clear();
      cacheRef.current.bySubcategory.clear();
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/featured`);
      setFeaturedProducts(response.data.data || []);
    } catch (err) {
      console.error("Error fetching featured products:", err);
    }
  }, [backendUrl]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/categories`);
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, [backendUrl]);

  // Optimized: Cache product by ID
  const getProductById = useCallback(
    async (id, forceRefresh = false) => {
      // Check if we already have this product in our products array
      const cachedProduct = products.find((p) => p._id === id);
      if (cachedProduct && !forceRefresh) {
        return cachedProduct;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/products/${id}`);
        return response.data.data;
      } catch (err) {
        console.error("Error fetching product:", err);
        return null;
      }
    },
    [backendUrl, products]
  );

  // Optimized: Cache search results with debouncing
  const searchProducts = useCallback(
    async (query, forceRefresh = false) => {
      const cacheKey = `search:${query.toLowerCase().trim()}`;

      // Return cached results if available
      if (cacheRef.current.bySearch.has(cacheKey) && !forceRefresh) {
        return cacheRef.current.bySearch.get(cacheKey);
      }

      try {
        const response = await axios.get(`${backendUrl}/api/products/search`, {
          params: { q: query },
        });
        const results = response.data.data || [];

        // Cache the results
        cacheRef.current.bySearch.set(cacheKey, results);

        // Limit cache size
        if (cacheRef.current.bySearch.size > 50) {
          const firstKey = cacheRef.current.bySearch.keys().next().value;
          cacheRef.current.bySearch.delete(firstKey);
        }

        return results;
      } catch (err) {
        console.error("Error searching products:", err);

        // Fallback to client-side search
        const lowerQuery = query.toLowerCase();
        const filtered = products.filter(
          (product) =>
            product.name?.toLowerCase().includes(lowerQuery) ||
            product.description?.toLowerCase().includes(lowerQuery) ||
            product.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );

        cacheRef.current.bySearch.set(cacheKey, filtered);
        return filtered;
      }
    },
    [backendUrl, products]
  );

  // OPTIMIZED: Get products by category with caching
  const getProductsByCategory = useCallback(
    async (category, forceRefresh = false) => {
      // Return cached results if available
      if (cacheRef.current.byCategory.has(category) && !forceRefresh) {
        return cacheRef.current.byCategory.get(category);
      }

      // First try to filter from existing products (client-side)
      const filteredFromState = products.filter(
        (product) => product.category === category
      );

      // If we have enough products in state, use them
      if (filteredFromState.length >= 8 && !forceRefresh) {
        cacheRef.current.byCategory.set(category, filteredFromState);
        return filteredFromState;
      }

      // Otherwise fetch from API
      try {
        const response = await axios.get(
          `${backendUrl}/api/products/category/${category}`
        );
        const result = response.data.data || [];

        // Cache the results
        cacheRef.current.byCategory.set(category, result);
        return result;
      } catch (err) {
        console.error("Error fetching products by category:", err);

        // Return whatever we have
        cacheRef.current.byCategory.set(category, filteredFromState);
        return filteredFromState;
      }
    },
    [backendUrl, products]
  );

  // OPTIMIZED: Get products by subcategory with caching
  const getProductsBySubcategory = useCallback(
    async (category, subcategory, forceRefresh = false) => {
      const cacheKey = `${category}:${subcategory}`;

      // Return cached results if available
      if (cacheRef.current.bySubcategory.has(cacheKey) && !forceRefresh) {
        return cacheRef.current.bySubcategory.get(cacheKey);
      }

      // First try to filter from existing products (client-side)
      const filteredFromState = products.filter(
        (product) =>
          product.category === category && product.subcategory === subcategory
      );

      // If we have enough products in state, use them
      if (filteredFromState.length >= 4 && !forceRefresh) {
        cacheRef.current.bySubcategory.set(cacheKey, filteredFromState);
        return filteredFromState;
      }

      // Otherwise fetch from API
      try {
        const response = await axios.get(
          `${backendUrl}/api/categories/category/${category}/subcategory/${subcategory}`
        );
        const result = response.data.data || [];

        // Cache the results
        cacheRef.current.bySubcategory.set(cacheKey, result);
        return result;
      } catch (err) {
        console.error("Error fetching products by subcategory:", err);

        // Return whatever we have
        cacheRef.current.bySubcategory.set(cacheKey, filteredFromState);
        return filteredFromState;
      }
    },
    [backendUrl, products]
  );

  // Preload popular categories
  const preloadCategory = useCallback(
    async (category) => {
      if (!cacheRef.current.byCategory.has(category)) {
        await getProductsByCategory(category);
      }
    },
    [getProductsByCategory]
  );

  // Clear specific cache
  const clearCache = useCallback((type, key = null) => {
    if (type === "category" && key) {
      cacheRef.current.byCategory.delete(key);
    } else if (type === "subcategory" && key) {
      cacheRef.current.bySubcategory.delete(key);
    } else if (type === "search" && key) {
      cacheRef.current.bySearch.delete(key);
    } else if (type === "all") {
      cacheRef.current.byCategory.clear();
      cacheRef.current.bySubcategory.clear();
      cacheRef.current.bySearch.clear();
    }
  }, []);

  // Get cache statistics (for debugging/analytics)
  const getCacheStats = useCallback(() => {
    return {
      byCategory: cacheRef.current.byCategory.size,
      bySubcategory: cacheRef.current.bySubcategory.size,
      bySearch: cacheRef.current.bySearch.size,
    };
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
    fetchCategories();
  }, [fetchProducts, fetchFeaturedProducts, fetchCategories]);

  return (
    <ProductContext.Provider
      value={{
        // State
        products,
        featuredProducts,
        categories,
        loading,
        error,

        // Actions
        fetchProducts,
        getProductsBySubcategory,
        getProductById,
        searchProducts,
        getProductsByCategory,
        refetchProducts: fetchProducts,

        // Cache management
        preloadCategory,
        clearCache,
        getCacheStats,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
