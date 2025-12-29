import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Star,
  Tag,
  Sparkles,
  Flame,
  Shirt,
  Laptop,
  Home,
  Footprints,
  Smartphone,
  X,
  Check,
  TrendingUp,
  Truck,
  Clock,
  Shield,
  Accessibility,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { ProductCard } from "../components/ui/ProductCard";
import assets from "../assets/assets";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { getIconComponent } from "../utils/icons";

const Shop = () => {
  // Use the ProductContext
  const { 
    products: allProducts, 
    categories: backendCategories, 
    loading, 
    getProductsByCategory,
    searchProducts 
  } = useProducts();
  
  // State management
  const location = useLocation();
  const navigate = useNavigate();
  const { category: categoryParam } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Check URL params first
    if (categoryParam) {
      return categoryParam;
    }
    // Then check location state
    if (location.state?.selectedCategory) {
      return location.state.selectedCategory;
    }
    return "all";
  });
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Categories derived from backend; map to icon components and include subcategories
  const categories = useMemo(() => {
    const all = {
      id: "all",
      name: "All Products",
      icon: <Flame className="h-4 w-4" />,
      color: "bg-gradient-to-r from-red-500 to-orange-500",
      path: "/shop",
    };

    const mapped = (backendCategories || []).map((cat) => {
      const id = cat.id || cat._id || String(cat.name || '').toLowerCase().replace(/\s+/g, '-');
      const IconComp = getIconComponent(cat.icon);
      const icon = IconComp ? <IconComp className="h-4 w-4" /> : <Tag className="h-4 w-4" />;
      const color = cat.color || 'bg-gradient-to-r from-blue-500 to-cyan-500';
      return {
        id,
        name: cat.name,
        icon,
        color,
        path: `/shop/${id}`,
        subcategories: cat.subcategoriesDetailed || cat.subcategories || [],
      };
    });

    return [all, ...mapped];
  }, [backendCategories]);

  // Extract unique brands from products (memoized for performance)
  const brands = useMemo(() => {
    const brandMap = new Map();
    allProducts.forEach(product => {
      if (product.brand) {
        brandMap.set(product.brand, (brandMap.get(product.brand) || 0) + 1);
      }
    });
    return Array.from(brandMap, ([name, count], index) => ({
      id: index + 1,
      name,
      productCount: count
    }));
  }, [allProducts]);

  // Sync URL category param with selectedCategory state
  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [categoryParam]);

  // Filter products based on selected category
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (selectedCategory === "all") {
        setProducts(allProducts);
        setIsSearching(false);
      } else {
        try {
          const categoryProducts = await getProductsByCategory(selectedCategory);
          setProducts(categoryProducts);
          setIsSearching(false);
        } catch (error) {
          // Fallback to filtering from allProducts if API fails
          const filtered = allProducts.filter(
            product => product.category === selectedCategory
          );
          setProducts(filtered);
          setIsSearching(false);
        }
      }
    };

    fetchProductsByCategory();
  }, [selectedCategory, allProducts, getProductsByCategory]);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        // If search query is empty, show all products for current category
        if (selectedCategory === "all") {
          setProducts(allProducts);
        }
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const searchResults = await searchProducts(searchQuery);
        setProducts(searchResults);
      } catch (error) {
        // Fallback to local filtering (moved after API attempt to minimize runtime in setTimeout)
        setIsSearching(false);
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setProducts(filtered);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, allProducts, selectedCategory, searchProducts]);

  // Filter products based on filters (memoized for performance)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1])
        return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand))
        return false;

      // Rating filter
      if (selectedRating > 0 && (product.rating || 0) < selectedRating) return false;

      return true;
    });
  }, [products, priceRange, selectedBrands, selectedRating]);

  // Sort products (memoized for performance)
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          // Use numeric ID comparison if available, otherwise string comparison
          return (b.id || 0) - (a.id || 0);
        case "featured":
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Handlers (memoized to prevent unnecessary re-renders)
  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
    toast.success(
      wishlist[productId] ? "Removed from wishlist" : "Added to wishlist"
    );
  }, [wishlist]);

  const toggleBrand = useCallback((brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory("all");
    setPriceRange([0, 500]);
    setSelectedBrands([]);
    setSelectedRating(0);
    setSearchQuery("");
    setCurrentPage(1);
    toast.success("Filters cleared");
  }, []);

  const addToCart = useCallback((product) => {
    toast.success(`${product.name} added to cart`);
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating || 0)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        )}
      />
    ));
  };

  // Clear location state after using it
  useEffect(() => {
    if (location.state?.selectedCategory) {
      // Clear the state so it doesn't persist on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <div className="mt-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">
            Discover our complete collection
          </p>
        </div>

        {/* Top Bar with Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort and View Controls */}
          <div className="flex gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none appearance-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar - Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm sticky top-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <div className="relative h-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 100, 250, 500].map((price) => (
                      <Button
                        key={price}
                        variant={
                          priceRange[1] === price ? "default" : "outline"
                        }
                        size="sm"
                        className="text-xs"
                        onClick={() => setPriceRange([0, price])}
                      >
                        Under ${price}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={
                        selectedCategory === cat.id ? "default" : "ghost"
                      }
                      className={cn(
                        "w-full justify-start",
                        selectedCategory === cat.id && cat.color
                      )}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-sm mb-3">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div
                        key={brand.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`brand-${brand.id}`}
                            checked={selectedBrands.includes(brand.name)}
                            onCheckedChange={() => toggleBrand(brand.name)}
                          />
                          <label
                            htmlFor={`brand-${brand.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {brand.name}
                          </label>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {brand.productCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ratings */}
              <div>
                <h3 className="font-medium text-sm mb-3">Customer Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={
                        selectedRating === rating ? "secondary" : "ghost"
                      }
                      className="w-full justify-between"
                      onClick={() =>
                        setSelectedRating(
                          rating === selectedRating ? 0 : rating
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          & above
                        </span>
                      </div>
                      {selectedRating === rating && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>
                    Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
                    products
                  </>
                )}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <select
                    value={productsPerPage}
                    onChange={(e) =>
                      setProductsPerPage(parseInt(e.target.value))
                    }
                    className="border border-input bg-background rounded px-3 py-1 text-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl border border-border p-4 animate-pulse"
                  >
                    <div className="h-48 bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div
                className={cn(
                  "gap-6",
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col"
                )}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={{
                      ...product,
                      id: product._id || product.id,
                      image: product.mainImage || product.images?.[0] || assets.cofeemaker,
                      originalPrice: product.originalPrice || product.price * 1.2,
                      discount: product.discount || Math.floor((1 - product.price / (product.originalPrice || product.price * 1.2)) * 100),
                      rating: product.rating || 4.0,
                      reviewCount: product.reviewCount || Math.floor(Math.random() * 200) + 50,
                      tags: product.tags || ["Popular", "Trending"].slice(0, Math.floor(Math.random() * 2) + 1),
                    }}
                    viewMode={viewMode}
                    onWishlistToggle={() => toggleWishlist(product._id || product.id)}
                    onAddToCart={() => addToCart(product)}
                    isInWishlist={wishlist[product._id || product.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {isSearching ? "Searching..." : "Try adjusting your filters or search terms"}
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

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
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden">
          <div
            className="absolute inset-0"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-card border-l border-border overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile filter content */}
              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-sm mb-4 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Price Range
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <div className="relative h-2">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([parseInt(e.target.value), priceRange[1]])
                        }
                        className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                      />
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], parseInt(e.target.value)])
                        }
                        className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={
                          selectedCategory === cat.id ? "default" : "ghost"
                        }
                        className={cn(
                          "w-full justify-start",
                          selectedCategory === cat.id && cat.color
                        )}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setCurrentPage(1);
                          setShowMobileFilters(false);
                        }}
                      >
                        <span className="mr-2">{cat.icon}</span>
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm mb-3">Brands</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div
                          key={brand.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`mobile-brand-${brand.id}`}
                              checked={selectedBrands.includes(brand.name)}
                              onCheckedChange={() => toggleBrand(brand.name)}
                            />
                            <label
                              htmlFor={`mobile-brand-${brand.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {brand.name}
                            </label>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {brand.productCount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ratings */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Customer Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <Button
                        key={rating}
                        variant={
                          selectedRating === rating ? "secondary" : "ghost"
                        }
                        className="w-full justify-between"
                        onClick={() =>
                          setSelectedRating(
                            rating === selectedRating ? 0 : rating
                          )
                        }
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(rating)}</div>
                          <span className="text-sm text-muted-foreground">
                            & above
                          </span>
                        </div>
                        {selectedRating === rating && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;