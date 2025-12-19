import React, { useState, useEffect, useRef } from "react";
import {
  FaTshirt,
  FaLaptop,
  FaCouch,
  FaShoePrints,
  FaMobileAlt,
  FaStar,
  FaShoppingCart,
  FaFire,
  FaShoppingBasket,
  FaUserTie,
  FaPersonBooth,
  FaChevronLeft,
  FaChevronRight,
  FaSprayCan,
  FaRunning,
  FaBook,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import assets, { fashionCategories } from "../assets/assets";
import {
  getFeaturedFashionProducts,
  getProductsByCategory,
} from "../utils/productUtils";

// Map fashion categories to icons
const categoryIcons = {
  shoes: <FaShoePrints />,
  clothing: <FaUserTie />,
  accessories: <FaShoppingBasket />,
};

const Categories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("fashion");
  const [displayProducts, setDisplayProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const iconMap = {
    FaTshirt: FaTshirt,
    FaLaptop: FaLaptop,
    FaCouch: FaCouch,
    FaShoePrints: FaShoePrints,
    FaMobileAlt: FaMobileAlt,
    FaUserTie: FaUserTie,
    FaShoppingBasket: FaShoppingBasket,
    FaSprayCan: FaSprayCan,
    FaRunning: FaRunning,
    FaBook: FaBook,
  };

  // Initialize with fashion products
  useEffect(() => {
    if (selectedCategory === "fashion") {
      setDisplayProducts(getFeaturedFashionProducts(8));
    } else if (fashionCategories.some((cat) => cat.id === selectedCategory)) {
      // If it's a fashion subcategory
      const products = getProductsByCategory(selectedCategory);
      setDisplayProducts(products.length > 0 ? products.slice(0, 8) : []);
    } else {
      // For other categories, create placeholder products
      const placeholderProducts = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1000, // Use high IDs to avoid conflict with real products
        name: `${
          selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
        } Product ${i + 1}`,
        price: (i + 1) * 29.99,
        originalPrice: (i + 1) * 39.99,
        discount: i % 3 === 0 ? 25 : i % 2 === 0 ? 15 : 0,
        rating: 4.5 - i * 0.1,
        reviewCount: Math.floor(Math.random() * 100) + 50,
        image: assets.shoe1, // Default image for placeholders
        isNew: i < 2,
        isBestSeller: i === 0 || i === 3,
      }));
      setDisplayProducts(placeholderProducts);
    }
  }, [selectedCategory]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // Combine fashion categories with general categories
  const allCategories = fashionCategories;

  // Get category name for display
  const getCategoryDisplayName = (categoryId) => {
    const category = allCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Get category icon
  const getCategoryIcon = (categoryId) => {
    const category = allCategories.find((cat) => cat.id === categoryId);
    if (category && category.icon) {
      const IconComponent = iconMap[category.icon];
      return IconComponent ? <IconComponent /> : <FaTshirt />;
    }
    return <FaTshirt />;
  };

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    console.log("Add to cart", productId);
    // Add your cart logic here
  };

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  // Check scroll position on resize
  useEffect(() => {
    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);
    checkScrollPosition(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      {/* Categories with Horizontal Scroll */}
      <div className="relative mb-10">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            aria-label="Scroll right"
          >
            <FaChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Scrollable Categories Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="flex overflow-x-auto scrollbar-hide gap-3 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {allCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 w-32 md:w-36 group relative cursor-pointer p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl border-2 ${
                selectedCategory === cat.id
                  ? "border-indigo-500 bg-gradient-to-b from-indigo-50 to-white"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div
                className={`p-3 rounded-full mb-3 transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-indigo-100"
                    : "bg-gray-50 group-hover:bg-gray-100"
                }`}
              >
                {React.cloneElement(getCategoryIcon(cat.id), {
                  className: `w-6 h-6 ${
                    selectedCategory === cat.id
                      ? "text-indigo-600"
                      : "text-gray-600 group-hover:text-gray-800"
                  }`,
                })}
              </div>

              <span
                className={`font-semibold text-sm text-center ${
                  selectedCategory === cat.id
                    ? "text-indigo-700"
                    : "text-gray-800"
                }`}
              >
                {cat.name}
              </span>

              {cat.totalProducts && (
                <span className="text-xs text-gray-500 mt-1 text-center">
                  {cat.totalProducts} items
                </span>
              )}

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-transform duration-300 ${
                  selectedCategory === cat.id
                    ? "scale-x-100 bg-indigo-500"
                    : "scale-x-0 bg-indigo-500 group-hover:scale-x-100"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Scroll Indicator Dots (Optional) */}
        <div className="flex justify-center gap-2 mt-4">
          {allCategories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const container = scrollContainerRef.current;
                  const itemWidth = 144; // w-36 = 144px
                  container.scrollTo({
                    left: index * itemWidth,
                    behavior: "smooth",
                  });
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedCategory === allCategories[index].id
                  ? "bg-indigo-600 w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to category ${index + 1}`}
            />
          ))}
        </div>

        {/* Subcategories Filter - only show if category has subcategories */}
        {(() => {
          // Find the selected category to check if it has subcategories
          const selectedCat = fashionCategories.find(
            (cat) => cat.id === selectedCategory
          );

          // Only show if this category has subcategories
          if (!selectedCat || !selectedCat.subcategories) {
            return null; // Don't show anything if no subcategories
          }

          return (
            <div className="mt-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Shop by Type
                </h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-full text-sm hover:bg-indigo-700 transition-colors">
                  All {selectedCat.name}
                </button>
                {selectedCat.subcategories.map((subcat, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-colors duration-200"
                  >
                    {subcat}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Products Section */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              {getCategoryDisplayName(selectedCategory)} Collection
              {selectedCategory === "fashion" && (
                <FaFire className="text-orange-500 w-5 h-5" />
              )}
            </h2>
            <p className="text-gray-600 mt-1">
              {displayProducts.length} handpicked items just for you
            </p>
          </div>
          <button
            onClick={() => navigate(`/shop/${selectedCategory}`)}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
          >
            View All Products
            <span className="text-lg">→</span>
          </button>
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products available in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
              >
                {/* Product Badges */}
                {product.tag && (
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        product.tagColor || "bg-red-500"
                      } text-white`}
                    >
                      {product.tag}
                    </span>
                  </div>
                )}

                {product.isNew && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                      NEW
                    </span>
                  </div>
                )}

                {/* Product Image */}
                <div
                  className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
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

                  <h3
                    className="font-bold text-gray-900 text-base mb-2 line-clamp-1 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {product.rating.toFixed(1)} ({product.reviewCount})
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-800">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.discount > 0 && (
                        <>
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">
                            -{product.discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Brand and Stock Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    {product.brand && (
                      <span className="font-medium">
                        Brand: {product.brand}
                      </span>
                    )}
                    {product.inStock !== undefined && (
                      <span
                        className={`font-medium ${
                          product.inStock ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product.id)}
                    disabled={product.inStock === false}
                    className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                      product.inStock === false
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-indigo-700 hover:to-indigo-800"
                    }`}
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    {product.inStock === false ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button for Mobile */}
        {displayProducts.length > 0 && (
          <div className="mt-8 flex justify-center lg:hidden">
            <button
              onClick={() => navigate(`/shop/${selectedCategory}`)}
              className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors duration-300"
            >
              View All {getCategoryDisplayName(selectedCategory)} Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
