import React from "react";
import { FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { featuredProducts } from "../assets/assets";
import { ProductCard } from "./ui/ProductCard";

const Featured = () => {
  const navigate = useNavigate();

  // Format product data for ProductCard
  const formatProductForCard = (product) => {
    return {
      id: product.id,
      name: product.name,
      description: product.description || "Premium featured product",
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating || 4.0,
      reviewCount: product.reviewCount || 100,
      image: product.image,
      category: product.category || "featured",
      brand: product.brand || "Premium Brand",
      inStock: true,
      badge: product.tag || null,
    };
  };

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
          onClick={() => navigate("/shop/featured")}
          className="mt-4 md:mt-0 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          View All Products
        </button>
      </div>

      {/* Products Grid using ProductCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={formatProductForCard(product)} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default Featured;