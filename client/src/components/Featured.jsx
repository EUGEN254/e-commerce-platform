import React from "react";
import { FaStar, FaShoppingCart, FaEye, FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

// You'll need to import your actual assets
// import shoe1 from "../assets/shoe1.jpg";

const Featured = () => {
  const navigate = useNavigate();

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Running Shoes",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.5,
      reviewCount: 128,
      image: assets.shoe1, 
      tag: "BEST SELLER",
      tagColor: "bg-red-500",
      discount: 25,
    },
    {
      id: 2,
      name: "Wireless Bluetooth Headphones",
      price: 129.99,
      originalPrice: 159.99,
      rating: 4.8,
      reviewCount: 256,
      image: assets.shoe1, 
      tag: "TRENDING",
      tagColor: "bg-blue-500",
      discount: 19,
    },
    {
      id: 3,
      name: "Designer T-Shirt Collection",
      price: 29.99,
      originalPrice: 49.99,
      rating: 4.3,
      reviewCount: 89,
      image: assets.shoe1, 
      tag: "SALE",
      tagColor: "bg-green-500",
      discount: 40,
    },
    {
      id: 4,
      name: "Laptop Backpack",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.4,
      reviewCount: 167,
      image: assets.shoe1, 
      tag: "POPULAR",
      tagColor: "bg-orange-500",
      discount: 29,
    },
    {
      id: 5,
      name: "Coffee Maker Deluxe",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.6,
      reviewCount: 213,
      image: assets.shoe1, 
      tag: "HOT",
      tagColor: "bg-pink-500",
      discount: 31,
    },
    {
      id: 6,
      name: "Coffee Maker Deluxe",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.6,
      reviewCount: 213,
      image: assets.shoe1, 
      tag: "HOT",
      tagColor: "bg-pink-500",
      discount: 31,
    },
    {
      id: 7,
      name: "Coffee Maker Deluxe",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.6,
      reviewCount: 213,
      image: assets.shoe1, 
      tag: "HOT",
      tagColor: "bg-pink-500",
      discount: 31,
    },
    
    
  ];

  const handleAddToCart = (e, productId) => {
    e.stopPropagation(); // Prevent navigation when clicking cart button
    console.log(`Added product ${productId} to cart`);
    // Add your cart logic here
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 cursor-pointer"
          >
            {/* Discount Badge */}
            {product.discount && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                  -{product.discount}%
                </span>
              </div>
            )}

            {/* Tag Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span
                className={`px-3 py-1 ${product.tagColor} text-white text-xs font-semibold rounded-full`}
              >
                {product.tag}
              </span>
            </div>

            {/* Product Image */}
            <div className="relative h-30 overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-30 h-30 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Quick Actions Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => handleAddToCart(e, product.id)}
                  className="p-3 bg-white rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                  title="Add to Cart"
                >
                  <FaShoppingCart className="w-5 h-5" />
                </button>
                <button
                  className="p-3 bg-white rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75"
                  title="Quick View"
                >
                  <FaEye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {product.rating} ({product.reviewCount})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-gray-800">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product.id)}
                  className="px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll Option (Alternative) */}
      {/* Uncomment if you want horizontal scroll on mobile */}
      {/*
      <div className="lg:hidden mt-6">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {featuredProducts.map((product) => (
            <div key={product.id} className="min-w-[280px]">
              // Same product card but min-width for horizontal scroll
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  );
};

export default Featured;