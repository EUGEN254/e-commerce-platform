// contexts/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/products`);
      setProducts(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);


  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/featured`);
      setFeaturedProducts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching featured products:', err);
    }
  }, [backendUrl]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/categories`);
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [backendUrl]);

  const getProductById = useCallback(async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/${id}`);
      return response.data.data;
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  }, [backendUrl]);

  const searchProducts = useCallback(async (query) => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/search`, {
        params: { q: query }
      });
      return response.data.data || [];
    } catch (err) {
      console.error('Error searching products:', err);
      return [];
    }
  }, [backendUrl]);

  const getProductsByCategory = useCallback(async (category) => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/category/${category}`);
      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching products by category:', err);
      return [];
    }
  }, [backendUrl]);

// contexts/ProductContext.jsx
const getProductsBySubcategory = useCallback(async (category, subcategory) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/categories/category/${category}/subcategory/${subcategory}`
    );
    return response.data.data || [];
  } catch (err) {
    console.error('Error fetching products by subcategory:', err);
    
    // Fallback: Filter from existing products
    return products.filter(
      product => product.category === category && product.subcategory === subcategory
    );
  }
}, [backendUrl, products]);

  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
    fetchCategories();
  }, [fetchProducts, fetchFeaturedProducts, fetchCategories]);

  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        categories,
        loading,
        error,
        fetchProducts,
        getProductsBySubcategory,
        getProductById,
        searchProducts,
        getProductsByCategory,
        refetchProducts: fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}