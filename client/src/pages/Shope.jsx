import React, { useState } from "react";
import {
  FaFilter,
  FaSortAmountDown,
  FaSearch,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaEye,
  FaTshirt,
  FaLaptop,
  FaHome,
  FaShoePrints,
  FaMobileAlt,
  FaTimes,
  FaCheck,
  FaFire,
  FaTag,
  FaPercent,
} from "react-icons/fa";
import assets from "../assets/assets";

const Shop = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Categories
  const categories = [
    { id: "all", name: "All Products", icon: <FaFire />, color: "from-red-500 to-orange-500" },
    { id: "fashion", name: "Fashion", icon: <FaTshirt />, color: "from-pink-500 to-rose-500" },
    { id: "electronics", name: "Electronics", icon: <FaLaptop />, color: "from-blue-500 to-cyan-500" },
    { id: "home", name: "Home & Kitchen", icon: <FaHome />, color: "from-amber-500 to-orange-500" },
    { id: "shoes", name: "Shoes", icon: <FaShoePrints />, color: "from-emerald-500 to-teal-500" },
    { id: "mobile", name: "Mobile", icon: <FaMobileAlt />, color: "from-purple-500 to-violet-500" },
  ];

  // Brands
  const brands = [
    { id: 1, name: "Nike", productCount: 42 },
    { id: 2, name: "Adidas", productCount: 38 },
    { id: 3, name: "Apple", productCount: 25 },
    { id: 4, name: "Samsung", productCount: 31 },
    { id: 5, name: "Sony", productCount: 19 },
    { id: 6, name: "Zara", productCount: 27 },
  ];

  // Sample products
  const products = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `Premium Product ${i + 1}`,
    description: `High-quality product with amazing features. Perfect for daily use and designed to last.`,
    price: 89.99 + (i * 15),
    originalPrice: 119.99 + (i * 15),
    discount: i % 4 === 0 ? 25 : i % 3 === 0 ? 15 : 0,
    rating: 4.5 - (i * 0.05),
    reviewCount: Math.floor(Math.random() * 200) + 50,
    category: categories[Math.floor(Math.random() * categories.length)].id,
    brand: brands[Math.floor(Math.random() * brands.length)].name,
    image: assets.shoe1,
    isNew: i < 5,
    isFeatured: i < 3,
    stock: i % 5 === 0 ? "Low Stock" : "In Stock",
    tags: ["Premium", "Popular", "Trending"].slice(0, Math.floor(Math.random() * 3) + 1),
  }));

  // Filter products
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    
    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    
    // Rating filter
    if (selectedRating > 0 && product.rating < selectedRating) return false;
    
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return b.isFeatured - a.isFeatured;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  // Handlers
  const toggleWishlist = (productId) => {
    setWishlist(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const toggleBrand = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName)
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, 500]);
    setSelectedBrands([]);
    setSelectedRating(0);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="px-5 lg:px-20 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shop</h1>
              <p className="text-gray-600 text-sm">
                {filteredProducts.length} products found
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 md:flex-initial">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
              >
                <FaFilter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-20 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar - Filters */}
          <div className={`hidden md:block w-64 flex-shrink-0 ${showMobileFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : ''}`}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaTag className="w-4 h-4" />
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">${priceRange[0]}</span>
                    <span className="text-gray-600">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex gap-2">
                    {[0, 100, 250, 500].map((price) => (
                      <button
                        key={price}
                        onClick={() => setPriceRange([0, price])}
                        className={`px-3 py-1 text-sm rounded-full ${
                          priceRange[1] === price
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Under ${price}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        selectedCategory === cat.id
                          ? "bg-gradient-to-r " + cat.color + " text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        selectedCategory === cat.id ? "bg-white/20" : "bg-gray-100"
                      }`}>
                        {cat.icon}
                      </div>
                      <span className="font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-4">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.name)}
                          onChange={() => toggleBrand(brand.name)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-gray-700">{brand.name}</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {brand.productCount}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-4">Customer Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                        selectedRating === rating
                          ? "bg-indigo-50 border border-indigo-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {renderStars(rating)}
                      </div>
                      <span className="text-gray-600 text-sm">& above</span>
                      {selectedRating === rating && (
                        <FaCheck className="ml-auto text-indigo-600 w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-gray-600">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Show:</span>
                  <select
                    value={productsPerPage}
                    onChange={(e) => setProductsPerPage(parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative h-56 overflow-hidden bg-gray-50">
                      {/* Badges */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {product.discount > 0 && (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            -{product.discount}%
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            NEW
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                            FEATURED
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200"
                      >
                        <FaHeart
                          className={`w-5 h-5 transition-colors ${
                            wishlist[product.id]
                              ? "text-red-500 fill-red-500"
                              : "text-gray-500 hover:text-red-500"
                          }`}
                        />
                      </button>

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Quick Actions */}
                      <div className="absolute inset-x-4 bottom-4 flex gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="flex-1 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                          <FaShoppingCart className="inline w-4 h-4 mr-1" />
                          Add to Cart
                        </button>
                        <button className="p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50">
                          <FaEye className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-5">
                      <div className="mb-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.brand}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.reviewCount})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xl font-bold text-gray-800">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          product.stock === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {product.stock}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaSearch className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              {/* Mobile filter content (same as desktop sidebar) */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;