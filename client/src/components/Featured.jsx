import React, { useState } from "react";
import { FaStar, FaShoppingCart, FaEye, FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import assets, { featuredProducts } from "../assets/assets";

// You'll need to import your actual assets
// import shoe1 from "../assets/shoe1.jpg";

const Featured = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(featuredProducts);

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
            className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            {/* Tag and Discount Badge - Add this section if you have tags */}
            {product.tag && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600 text-white">
                  {product.tag}
                </span>
              </div>
            )}

            {product.discount && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500 text-white animate-pulse">
                  -{product.discount}%
                </span>
              </div>
            )}

            {/* Product Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Product Details */}
            <div className="p-5">
              {/* Category Badge */}
              {product.category && (
                <span className="inline-block px-2 py-1 mb-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                  {product.category}
                </span>
              )}

              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
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
                <span className="text-xs text-gray-600 font-medium">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xs text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        {product.discount && (
                          <span className="text-xs font-bold text-red-500">
                            Save{" "}
                            {(
                              ((product.originalPrice - product.price) /
                                product.originalPrice) *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {product.shipping && (
                    <span className="text-xs text-green-600 font-medium mt-1">
                      {product.shipping}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(e, product.id);
                  }}
                  className="px-4 py-2 bg-indigo-800 text-white text-xs font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
