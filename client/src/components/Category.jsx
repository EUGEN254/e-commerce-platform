import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import { getIconComponent } from "../utils/icons";
import { logError } from "../utils/errorHandler";

const Categories = () => {
  const navigate = useNavigate();
  const {
    products,
    loading: initialLoading,
    categories,
    error,
    getProductsByCategory,
    getProductsBySubcategory,
    preloadCategory,
  } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState("fashion");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  
  // Debounce and caching refs
  const clickTimeoutRef = useRef(null);
  const lastCategoryRef = useRef("");
  const lastSubcategoryRef = useRef("");
  const scrollDebounceRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

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

  // Optimized product loading with cache check
  const loadProducts = useCallback(async () => {
    if (!selectedCategory) return;
    
    // Check if we already have the same selection
    if (selectedCategory === lastCategoryRef.current && 
        selectedSubcategory === lastSubcategoryRef.current &&
        displayProducts.length > 0) {
      return; // Skip if same selection
    }
    
    // Update refs
    lastCategoryRef.current = selectedCategory;
    lastSubcategoryRef.current = selectedSubcategory;
    
    try {
      setLoadingProducts(true);
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
        filteredProducts = await getProductsByCategory(selectedCategory);
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
      logError("Category loadProducts", error);
      // Fallback to products in context
      const fallbackProducts = products.filter(
        (product) => product.category === selectedCategory &&
                   (selectedSubcategory === "All" || product.subcategory === selectedSubcategory)
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
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedCategory, selectedSubcategory, products, getProductsBySubcategory, getProductsByCategory]);

  // Debounced category click handler
  const handleCategoryClick = useCallback((categoryId) => {
    if (categoryId === selectedCategory) return; // Skip if already selected
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      setSelectedCategory(categoryId);
      setSelectedSubcategory("All");
      // Don't clear products immediately - show loading state instead
    }, 150); // 150ms debounce
  }, [selectedCategory]);

  // Debounced subcategory click handler
  const handleSubcategoryClick = useCallback((subcategory) => {
    if (subcategory === selectedSubcategory) return; // Skip if already selected
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      setSelectedSubcategory(subcategory);
    }, 150);
  }, [selectedSubcategory]);

  // Clear subcategory filter
  const clearSubcategoryFilter = useCallback(() => {
    setSelectedSubcategory("All");
  }, []);

  // Preload next category on hover
  const handleCategoryHover = useCallback((categoryId) => {
    if (categoryId !== selectedCategory) {
      // Preload the category data in background
      preloadCategory(categoryId);
    }
  }, [selectedCategory, preloadCategory]);

  // Load products when category or subcategory changes
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Preload first few categories on initial mount
  useEffect(() => {
    if (categories.length > 0) {
      // Preload first 3 categories for instant switching
      const firstThreeCategories = categories.slice(0, 3);
      firstThreeCategories.forEach(cat => {
        if (cat.id !== selectedCategory) {
          preloadCategory(cat.id);
        }
      });
    }
  }, [categories, selectedCategory, preloadCategory]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const getCategoryDisplayName = useCallback((categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  }, [categories]);

  const getCategoryIcon = useCallback((categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category && category.icon) {
      const IconComponent = getIconComponent(category.icon);
      if (!IconComponent) return <span className="text-xl">{category.icon || '📁'}</span>;
      return <IconComponent />;
    }
    return <FaTshirt />;
  }, [categories]);

  const checkScrollPosition = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollWidth - clientWidth - 10 > scrollLeft;

    setShowLeftArrow(Boolean(canScrollLeft));
    setShowRightArrow(Boolean(canScrollRight));
  }, []);

  // Debounced scroll handler to prevent forced reflows
  const handleScroll = useCallback(() => {
    // Cancel pending scroll checks
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    // Schedule a new check after scroll settles (100ms)
    scrollTimeoutRef.current = setTimeout(checkScrollPosition, 100);
  }, [checkScrollPosition]);

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
    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [checkScrollPosition]);

  // Re-check scroll position after categories or displayProducts change
  useEffect(() => {
    // allow layout to settle
    const t = setTimeout(() => checkScrollPosition(), 60);
    return () => clearTimeout(t);
  }, [categories, displayProducts, selectedCategory, checkScrollPosition]);

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

  const isLoading = initialLoading || loadingProducts;

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
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide gap-3 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              onMouseEnter={() => handleCategoryHover(cat.id)}
              className={`shrink-0 w-32 md:w-36 group relative cursor-pointer p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl border-2 ${
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

              {/* Loading indicator for selected category */}
              {selectedCategory === cat.id && isLoading && (
                <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
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
                      className="hover:text-indigo-900 transition-colors"
                      aria-label="Clear filter"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate(`/shop/${selectedCategory}`)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
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
              {!isLoading ? `${displayProducts.length} ` : ""}
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
              onClick={() => navigate("/shop")}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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