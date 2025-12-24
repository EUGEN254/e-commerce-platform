import React, { useState, useEffect, useRef, useCallback } from "react";
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
  FaChevronLeft,
  FaChevronRight,
  FaSprayCan,
  FaRunning,
  FaBook,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "./ui/ProductCard";
import { useProducts } from "../context/ProductContext";

const Categories = () => {
  const navigate = useNavigate();
  const {
    products,
    loading: initialLoading,
    categories,
    error,
    getProductsByCategory,
    getProductsBySubcategory,
    
  } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState("fashion");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
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

  // Optimized product loading function
  const loadProducts = useCallback(async () => {
    if (!selectedCategory) return;
    
    try {
      let filteredProducts = [];
      
      // CASE 1: Specific subcategory selected
      if (selectedSubcategory !== "All") {
        filteredProducts = await getProductsBySubcategory(
          selectedCategory, 
          selectedSubcategory
          
        );
      }
      // CASE 2: Category selected (no specific subcategory)
      else {
        // First check if we have enough products in context
        const contextProducts = products.filter(
          (product) => product.category === selectedCategory
        );
        
        // Use context products if we have at least 4, otherwise fetch fresh
        filteredProducts = contextProducts.length >= 4 
          ? contextProducts 
          : await getProductsByCategory(selectedCategory);
      }
      
      // Transform the data for ProductCard
      const transformedProducts = filteredProducts
        .slice(0, 12)
        .map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          rating: product.rating,
          reviewCount: product.reviewCount,
          image: product.mainImage || product.images?.[0] || "",
          isNew: product.isNew || false,
          isBestSeller: product.isBestSeller || false,
          isFeatured: product.isFeatured || false,
          brand: product.brand,
          category: product.category,
          subcategory: product.subcategory,
          description: product.shortDescription || product.description,
          stock: product.stock,
          inStock: product.inStock,
          tags: product.tags || [],
          features: product.features || [],
        }));

      setDisplayProducts(transformedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      // Fallback to products in context
      const fallbackProducts = products.filter(
        (product) => product.category === selectedCategory
      );
      
      const transformedFallback = fallbackProducts
        .slice(0, 12)
        .map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          rating: product.rating,
          reviewCount: product.reviewCount,
          image: product.mainImage || product.images?.[0] || "",
          isNew: product.isNew || false,
          isBestSeller: product.isBestSeller || false,
          isFeatured: product.isFeatured || false,
          brand: product.brand,
          category: product.category,
          subcategory: product.subcategory,
          description: product.shortDescription || product.description,
          stock: product.stock,
          inStock: product.inStock,
          tags: product.tags || [],
          features: product.features || [],
        }));
      
      setDisplayProducts(transformedFallback);
    }
  }, [selectedCategory, selectedSubcategory, products, getProductsBySubcategory, getProductsByCategory]);

  // Load products when category or subcategory changes
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle category click
  const handleCategoryClick = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory("All");
    setDisplayProducts([]); // Clear products for immediate feedback
  }, []);

  // Handle subcategory click
  const handleSubcategoryClick = useCallback((subcategory) => {
    setSelectedSubcategory(subcategory);
    setDisplayProducts([]); // Clear products for immediate feedback
  }, []);

  // Clear subcategory filter
  const clearSubcategoryFilter = useCallback(() => {
    setSelectedSubcategory("All");
    setDisplayProducts([]); // Clear products for immediate feedback
  }, []);

  const getCategoryDisplayName = useCallback((categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  }, [categories]);

  const getCategoryIcon = useCallback((categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category && category.icon) {
      const IconComponent = iconMap[category.icon];
      return IconComponent ? <IconComponent /> : <FaTshirt />;
    }
    return <FaTshirt />;
  }, [categories]);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

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

  useEffect(() => {
    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);
    checkScrollPosition();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show error state
  if (error) {
    return (
      <div className="mt-10 px-5 lg:px-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Error Loading Products
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isLoading = initialLoading || displayProducts.length === 0;

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
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`shrink-0 w-32 md:w-36 group relative cursor-pointer p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl border-2 ${
                selectedCategory === cat.id
                  ? "border-indigo-500 bg-linear-to-b from-indigo-50 to-white"
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
      </div>

      {/* Subcategories Filter */}
      {(() => {
        const selectedCat = categories.find(
          (cat) => cat.id === selectedCategory
        );

        if (!selectedCat || !selectedCat.subcategories) {
          return null;
        }

        return (
          <div className="mt-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Shop by Type
                </h3>

                {/* Active filter badge */}
                {selectedSubcategory !== "All" && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    <span>{selectedSubcategory}</span>
                    <button
                      onClick={clearSubcategoryFilter}
                      className="hover:text-indigo-900"
                      aria-label="Clear filter"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate(`/shop/${selectedCategory}`)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View all
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSubcategoryClick("All")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSubcategory === "All"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                All {selectedCat.name}
              </button>

              {selectedCat.subcategories.map((subcat, index) => (
                <button
                  key={index}
                  onClick={() => handleSubcategoryClick(subcat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubcategory === subcat
                      ? "bg-indigo-100 border border-indigo-300 text-indigo-700"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Products Section */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              {selectedSubcategory !== "All"
                ? selectedSubcategory
                : getCategoryDisplayName(selectedCategory)}
              {selectedSubcategory !== "All" ? (
                <span className="text-base font-normal text-gray-600">
                  ({getCategoryDisplayName(selectedCategory)})
                </span>
              ) : null}
              {selectedCategory === "fashion" && (
                <FaFire className="text-orange-500 w-5 h-5" />
              )}
            </h2>
            <p className="text-gray-600 mt-1">
              {displayProducts.length}{" "}
              {selectedSubcategory !== "All"
                ? selectedSubcategory.toLowerCase()
                : "handpicked"}{" "}
              items just for you
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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products available in this category yet.
            </p>
            <button
              onClick={clearSubcategoryFilter}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product, index) => (
              <ProductCard
                key={product.id || product._id || index}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}

        {/* View All Button for Mobile */}
        {displayProducts.length > 0 && !isLoading && (
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