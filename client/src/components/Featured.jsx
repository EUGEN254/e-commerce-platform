import React from "react";
import { FaFire, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { ProductCard } from "./ui/ProductCard";
import assets from "../assets/assets";

const Featured = () => {
  const navigate = useNavigate();
  const { products, featuredProducts, loading } = useProducts();

  // Format product data for ProductCard
  const formatProductForCard = (product) => {
    return {
      id: product._id || product.id,
      name: product.name || "Unnamed Product",
      description: product.shortDescription || product.description || "Premium featured product",
      price: product.price || 0,
      originalPrice: product.originalPrice || null,
      rating: product.rating || 4.0,
      reviewCount: product.reviewCount || Math.floor(Math.random() * 100) + 50,
      image: product.mainImage || product.images?.[0] || assets.shoe1,
      category: product.category || "featured",
      brand: product.brand || "Premium Brand",
      inStock: product.inStock !== undefined ? product.inStock : true,
      stock: product.stock || 0,
      badge: product.badge || (product.isFeatured ? "PREMIUM" : product.isBestSeller ? "BEST SELLER" : product.isNew ? "NEW" : null),
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false,
      isFeatured: product.isFeatured || false,
      tags: product.tags || [],
      discount: product.discount || 0,
    };
  };

  // Get featured products: either from context or filter from all products
  const getFeaturedProducts = () => {
    if (featuredProducts && featuredProducts.length > 0) {
      return featuredProducts;
    }
    
    if (products && products.length > 0) {
      // Filter for featured products or take top products
      const featured = products.filter(product => 
        product.isFeatured || product.isBestSeller || product.rating >= 4.5
      );
      
      if (featured.length >= 4) {
        return featured.slice(0, 4);
      }
      
      // If not enough featured, take top-rated products
      return products
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);
    }
    
    return [];
  };

  const displayProducts = getFeaturedProducts();

  if (loading && displayProducts.length === 0) {
    return (
      <div className="mt-12 px-5 lg:px-5">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading featured products...</span>
        </div>
      </div>
    );
  }

  if (displayProducts.length === 0 && !loading) {
    return (
      <div className="mt-12 px-5 lg:px-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaFire className="text-orange-500 w-6 h-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Featured Products
              </h2>
            </div>
            <p className="text-gray-600">
              Discover our most popular and trending items
            </p>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 md:mt-0 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Browse All Products
          </button>
        </div>

        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FaFire className="text-gray-300 w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Featured Products Available
          </h3>
          <p className="text-gray-500 mb-6">
            Check back soon for our featured collection!
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Explore All Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 px-5 lg:px-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaFire className="text-orange-500 w-6 h-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Featured Products
            </h2>
          </div>
          <p className="text-gray-600">
            Discover our most popular and trending items
          </p>
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="mt-4 md:mt-0 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          View All Products
        </button>
      </div>

      {/* Products Grid using ProductCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product, index) => (
          <ProductCard 
            key={product._id || product.id || index} 
            product={formatProductForCard(product)} 
            index={index} 
          />
        ))}
      </div>

      {/* View All Button for Mobile */}
      <div className="mt-8 flex justify-center lg:hidden">
        <button
          onClick={() => navigate("/shop")}
          className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors duration-300"
        >
          View All Featured Products
        </button>
      </div>
    </div>
  );
};

export default Featured;