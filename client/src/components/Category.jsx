import React, { useState } from "react";
import {
  FaTshirt,
  FaLaptop,
  FaCouch,
  FaShoePrints,
  FaMobileAlt,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaEye,
  FaFire,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const categories = [
  { name: "Fashion", icon: <FaTshirt />, path: "/shop/fashion",  },
  { name: "Electronics", icon: <FaLaptop />, path: "/shop/electronics",  },
  { name: "Home", icon: <FaCouch />, path: "/shop/home",  },
  { name: "Shoes", icon: <FaShoePrints />, path: "/shop/shoes",  },
  { name: "Mobile", icon: <FaMobileAlt />, path: "/shop/mobile" },
];

const Categories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Fashion");
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (productId) => {
    setWishlist(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Enhanced products with more details
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    name: `${selectedCategory} Product ${i + 1}`,
    price: (i + 1) * 29.99,
    originalPrice: (i + 1) * 39.99,
    discount: i % 3 === 0 ? 25 : i % 2 === 0 ? 15 : 0,
    rating: 4.5 - (i * 0.1),
    reviewCount: Math.floor(Math.random() * 100) + 50,
    image: assets.shoe1,
    isNew: i < 2,
    isBestSeller: i === 0 || i === 3,
  }));

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="mt-10 px-5 lg:px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Shop by Category
          </h2>
          <p className="text-gray-600 mt-1">Browse our featured collections</p>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(cat.name)}
            className={`group relative cursor-pointer p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl border-2 ${
              selectedCategory === cat.name
                ? `border-indigo-500 bg-gradient-to-b`
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <div className={`p-3 rounded-full mb-3 transition-all duration-300 ${
              selectedCategory === cat.name
                ? "bg-white/20"
                : "bg-gray-50 group-hover:bg-gray-100"
            }`}>
              {React.cloneElement(cat.icon, {
                className: `w-6 h-6 ${
                  selectedCategory === cat.name
                    ? "text-black"
                    : "text-gray-600 group-hover:text-gray-800"
                }`,
              })}
            </div>

            <span className={`font-semibold text-sm text-center ${
              selectedCategory === cat.name
                ? "text-black"
                : "text-gray-800"
            }`}>
              {cat.name}
            </span>

            <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-transform duration-300 ${
              selectedCategory === cat.name
                ? "scale-x-100 bg-white/50"
                : "scale-x-0 bg-indigo-500 group-hover:scale-x-100"
            }`} />
          </div>
        ))}
      </div>

      {/* Products Section */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              {selectedCategory} Collection
              {selectedCategory === "Fashion" && <FaFire className="text-orange-500 w-5 h-5" />}
            </h2>
            <p className="text-gray-600 mt-1">Handpicked items just for you</p>
          </div>
          <button 
            onClick={() => navigate(`/shop/${selectedCategory.toLowerCase()}`)}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
          >
            View All Products
            <span className="text-lg">→</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
            >
              {/* Badges */}
              <div className="absolute top-1 left-1 z-10 flex flex-col gap-1">
                {product.discount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    -{product.discount}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <FaFire className="w-3 h-3" />
                    BESTSELLER
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow-sm"
              >
                <FaHeart
                  className={`w-5 h-5 transition-colors ${
                    wishlist[product.id]
                      ? "text-red-500 fill-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                />
              </button>

              {/* Product Image */}
              <div
                className="relative h-40 overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Add to cart", product.id);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg"
                    title="Add to Cart"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Quick view", product.id);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg delay-75"
                    title="Quick View"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5">
                <h3 
                  className="font-bold text-gray-800 text-sm md:text-base mb-2 line-clamp-1 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-gray-500">
                    {product.rating.toFixed(1)} ({product.reviewCount})
                  </span>
                </div>

                {/* Price Section - Enhanced */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-800">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">
                          Save ${(product.originalPrice - product.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Add to cart", product.id);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>

                {/* Installment Option */}
                {product.price > 50 && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">
                      Or 4 interest-free payments of <span className="font-semibold text-gray-700">
                        ${(product.price / 4).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button for Mobile */}
        <div className="mt-8 flex justify-center lg:hidden">
          <button 
            onClick={() => navigate(`/shop/${selectedCategory.toLowerCase()}`)}
            className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors duration-300"
          >
            View All {selectedCategory} Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;