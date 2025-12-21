import { useState, useEffect } from 'react';
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
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { ProductCard } from '../components/ui/ProductCard';
import assets from '../assets/assets';

const Shop = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Categories
  const categories = [
    { id: 'all', name: 'All Products', icon: <Flame className="h-4 w-4" />, color: 'bg-gradient-to-r from-red-500 to-orange-500' },
    { id: 'fashion', name: 'Fashion', icon: <Shirt className="h-4 w-4" />, color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { id: 'electronics', name: 'Electronics', icon: <Laptop className="h-4 w-4" />, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'home', name: 'Home & Kitchen', icon: <Home className="h-4 w-4" />, color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
    { id: 'shoes', name: 'Shoes', icon: <Footprints className="h-4 w-4" />, color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    { id: 'mobile', name: 'Mobile', icon: <Smartphone className="h-4 w-4" />, color: 'bg-gradient-to-r from-purple-500 to-violet-500' },
  ];

  // Brands
  const brands = [
    { id: 1, name: 'Nike', productCount: 42 },
    { id: 2, name: 'Adidas', productCount: 38 },
    { id: 3, name: 'Apple', productCount: 25 },
    { id: 4, name: 'Samsung', productCount: 31 },
    { id: 5, name: 'Sony', productCount: 19 },
    { id: 6, name: 'Zara', productCount: 27 },
  ];

  // Sample products data (you would replace with actual data from your API or data file)
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
    image: assets.cofeemaker,
    isNew: i < 5,
    isFeatured: i < 3,
    stock: i % 5 === 0 ? 'Low Stock' : 'In Stock',
    tags: ['Premium', 'Popular', 'Trending'].slice(0, Math.floor(Math.random() * 3) + 1),
  }));

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    
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
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
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
    toast.success(wishlist[productId] ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const toggleBrand = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName)
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 500]);
    setSelectedBrands([]);
    setSelectedRating(0);
    setSearchQuery('');
    setCurrentPage(1);
    toast.success('Filters cleared');
  };

  const addToCart = (product) => {
    toast.success(`${product.name} added to cart`);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          'h-4 w-4',
          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        )}
      />
    ));
  };

  return (
    <div>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">Discover our complete collection</p>
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
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
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
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 100, 250, 500].map((price) => (
                      <Button
                        key={price}
                        variant={priceRange[1] === price ? 'default' : 'outline'}
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
                      variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        selectedCategory === cat.id && cat.color
                      )}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                      }}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-3">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center justify-between">
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

              {/* Ratings */}
              <div>
                <h3 className="font-medium text-sm mb-3">Customer Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={selectedRating === rating ? 'secondary' : 'ghost'}
                      className="w-full justify-between"
                      onClick={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">& above</span>
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
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <select
                    value={productsPerPage}
                    onChange={(e) => setProductsPerPage(parseInt(e.target.value))}
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
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
                    <div className="h-48 bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className={cn(
                'gap-6',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                  : 'flex flex-col'
              )}>
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onWishlistToggle={() => toggleWishlist(product.id)}
                    onAddToCart={() => addToCart(product)}
                    isInWishlist={wishlist[product.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                        variant={currentPage === pageNum ? 'default' : 'outline'}
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
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
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
          <div className="absolute inset-0" onClick={() => setShowMobileFilters(false)} />
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
              
              {/* Mobile filter content (same as desktop sidebar) */}
              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-sm mb-4 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Price Range
                  </h3>
                  {/* ... same price range content ... */}
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Categories</h3>
                  {/* ... same categories content ... */}
                </div>
                
                {/* Brands */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Brands</h3>
                  {/* ... same brands content ... */}
                </div>
                
                {/* Ratings */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Customer Rating</h3>
                  {/* ... same ratings content ... */}
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