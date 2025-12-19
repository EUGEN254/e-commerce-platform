// utils/productUtils.js
import { 
  fashionProductsByCategory,
  fashionProductsBySubcategory,
  featuredFashionProducts,
  featuredProducts 
} from '../assets/assets';

// Utility functions for fashion products
export const getFashionProductById = (id) => {
  return [...featuredFashionProducts, 
          ...(fashionProductsByCategory.shoes || []), 
          ...(fashionProductsByCategory.clothing || []), 
          ...(fashionProductsByCategory.accessories || [])]
    .find(product => product.id === id);
};

export const getProductsByCategory = (categoryId) => {
  return fashionProductsByCategory[categoryId] || [];
};

export const getFeaturedFashionProducts = (limit = 8) => {
  return featuredFashionProducts.slice(0, limit);
};

export const getFashionProductsWithDiscount = (minDiscount = 20) => {
  return featuredFashionProducts.filter(product => product.discount >= minDiscount);
};

// Utility functions for general products
export const getProductById = (id) => {
  return featuredProducts.find(product => product.id === id);
};

export const getFeaturedProducts = (limit = 5) => {
  return featuredProducts.slice(0, limit);
};

// Search utility
export const searchProducts = (query, products) => {
  return products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description?.toLowerCase().includes(query.toLowerCase()) ||
    product.brand?.toLowerCase().includes(query.toLowerCase())
  );
};

// Filter utility
export const filterProducts = (products, filters) => {
  return products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (filters.minRating && product.rating < filters.minRating) return false;
    if (filters.inStock && !product.inStock) return false;
    return true;
  });
};

// Helper function to get products by subcategory
export const getProductsBySubcategory = (subcategoryName) => {
  return fashionProductsBySubcategory[subcategoryName] || [];
};

// Helper function to get fashion-only categories
export const getFashionSubcategories = () => {
  return fashionCategories.filter((cat) => cat.type === "fashion");
};

// Helper function to get main categories
export const getMainCategories = () => {
  return fashionCategories.filter((cat) => cat.isMainCategory);
};

