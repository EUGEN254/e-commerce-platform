import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaShareAlt,
  FaTruck,
  FaShieldAlt,
  FaRedo,
  FaCreditCard,
  FaPlus,
  FaMinus,
  FaTag,
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaWhatsapp,
  FaCheckCircle,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import assets from "../assets/assets";

const ProductDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, getProductById } = useProducts();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState({ value: "black", name: "Black", hex: "#000000" });
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [activeTab, setActiveTab] = useState("Description");

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, products]);

  const fetchProduct = async () => {
    if (products.length > 0) {
      // Find product in loaded products
      const foundProduct = products.find(p => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        findRelatedProducts(foundProduct);
        
        // Set default color if available
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
        
        // Set default size if available
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
      } else {
        // Try to fetch from API if not in loaded products
        try {
          const fetchedProduct = await getProductById(id);
          if (fetchedProduct) {
            setProduct(fetchedProduct);
            findRelatedProducts(fetchedProduct);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    }
  };

  const findRelatedProducts = (currentProduct) => {
    if (!currentProduct || !products.length) return;
    
    const related = products.filter(p => 
      p._id !== currentProduct._id && 
      (p.category === currentProduct.category || p.subcategory === currentProduct.subcategory)
    ).slice(0, 4);
    
    setRelatedProducts(related);
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Loading Product...</h1>
          <p className="text-gray-600">Please wait while we fetch the product details.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you are looking for does not exist.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const reviews = product.reviews || [
    {
      id: 1,
      name: "Alex Johnson",
      rating: product.rating || 4.5,
      date: "2 days ago",
      comment: "Great product! Exactly as described.",
      verified: true,
      helpful: 24,
    },
    {
      id: 2,
      name: "Sarah Miller",
      rating: 4,
      date: "1 week ago",
      comment: "Good quality, but shipping took longer than expected.",
      verified: true,
      helpful: 18,
    },
    {
      id: 3,
      name: "Michael Chen",
      rating: 5,
      date: "3 days ago",
      comment: "Perfect! Would definitely buy again.",
      verified: true,
      helpful: 32,
    },
  ];

  const handleQuantityChange = (type) => {
    if (type === "increment" && quantity < (product.stock || 10)) {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      productId: product._id,
      name: product.name,
      quantity,
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      total: (product.price * quantity).toFixed(2)
    });
    // Add to cart logic here
  };

  const handleImageHover = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const renderStars = (rating) => {
    const starRating = rating || 0;
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(starRating) ? "text-yellow-400" : "text-gray-300"
        } ${i < starRating && i >= Math.floor(starRating) ? "text-yellow-300" : ""}`}
      />
    ));
  };

  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images;
    } else if (product.mainImage) {
      return [product.mainImage];
    }
    return [assets.shoe1]; // Fallback image
  };

  const images = getProductImages();
  const productFeatures = product.features || [];
  const productSpecs = product.specs || {};
  const productColors = product.colors || [{ value: "black", name: "Black", hex: "#000000" }];
  const productSizes = product.sizes || ["S", "M", "L", "XL", "XXL"];
  const productTags = product.tags || [];
  const productDiscount = product.discount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="px-5 lg:px-20 py-4">
          <div className="max-w-6xl mx-auto">
            <nav className="text-sm">
              <ol className="flex items-center space-x-2">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Home
                  </button>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <button
                    onClick={() => navigate("/shop")}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    Shop
                  </button>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <button
                    onClick={() => navigate("/shop", { state: { selectedCategory: product.category?.toLowerCase() || "fashion" } })}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    {product.category || "Category"}
                  </button>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-800 font-medium truncate">
                  {product.name}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-10 py-3">
        <div className="max-w-6xl mx-auto">
          {/* Main Product Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Left Column - Images */}
              <div>
                {/* Main Image with Zoom */}
                <div
                  className="relative rounded-xl overflow-hidden bg-gray-100 mb-4 cursor-zoom-in"
                  onMouseMove={handleImageHover}
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
                  style={{ minHeight: "400px" }}
                >
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = assets.shoe1;
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {productDiscount > 0 && (
                      <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                        -{productDiscount}%
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                        FEATURED
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">
                        BESTSELLER
                      </span>
                    )}
                    {product.isNew && (
                      <span className="px-3 py-1 bg-purple-500 text-white text-sm font-bold rounded-full">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Zoom Preview */}
                  {showZoom && (
                    <div className="absolute top-0 right-0 bottom-0 left-0 overflow-hidden">
                      <div
                        className="absolute w-full h-full bg-cover bg-no-repeat"
                        style={{
                          backgroundImage: `url(${images[activeImage]})`,
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          transform: "scale(2)",
                        }}
                      />
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage((prev) => prev > 0 ? prev - 1 : images.length - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <FaChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => setActiveImage((prev) => prev < images.length - 1 ? prev + 1 : 0)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <FaChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Fullscreen Button */}
                  <button className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <FaExpand className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`relative rounded-lg overflow-hidden border-2 ${
                          activeImage === index
                            ? "border-indigo-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-20 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.shoe1;
                          }}
                        />
                        {activeImage === index && (
                          <div className="absolute inset-0 bg-indigo-500/20" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Product Info */}
              <div>
                {/* Category & Brand */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {product.category || "Uncategorized"}
                  </span>
                  {product.subcategory && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {product.subcategory}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {product.brand || "Brand"}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-gray-600">
                    {product.rating?.toFixed(1) || "4.5"} ({product.reviewCount || reviews.length} reviews)
                  </span>
                  <span className={`text-sm font-medium flex items-center gap-1 ${
                    product.inStock ? "text-green-600" : "text-red-600"
                  }`}>
                    <FaCheckCircle className="w-4 h-4" />
                    {product.inStock ? `In Stock (${product.stock || 10} left)` : 'Out of Stock'}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-800">
                      ${product.price?.toFixed(2) || "0.00"}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-bold">
                          Save ${(product.originalPrice - product.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    Including all taxes
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-700">
                    {product.description || product.shortDescription || "No description available."}
                  </p>
                </div>

                {/* Color Selection */}
                {productColors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Color: {selectedColor.name}
                    </h3>
                    <div className="flex gap-3">
                      {productColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 ${
                            selectedColor.value === color.value
                              ? "border-indigo-600"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {productSizes.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800">Size</h3>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800">
                        Size Guide →
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {productSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 rounded-lg border-2 text-center font-medium transition-all ${
                            selectedSize === size
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                              : "border-gray-300 hover:border-gray-400 text-gray-700"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange("decrement")}
                        disabled={quantity <= 1}
                        className={`px-4 py-3 ${
                          quantity <= 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <FaMinus className="w-4 h-4" />
                      </button>
                      <span className="px-6 py-3 text-lg font-bold min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange("increment")}
                        disabled={quantity >= (product.stock || 10)}
                        className={`px-4 py-3 ${
                          quantity >= (product.stock || 10) ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <FaPlus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className={`flex-1 py-3 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                        product.inStock 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      {product.inStock 
                        ? `Add to Cart - $${((product.price || 0) * quantity).toFixed(2)}`
                        : 'Out of Stock'}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <button
                    onClick={() => setIsInWishlist(!isInWishlist)}
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                      isInWishlist
                        ? "border-red-300 bg-red-50 text-red-600"
                        : "border-gray-300 hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    <FaHeart className={`w-5 h-5 ${isInWishlist ? "fill-red-500" : ""}`} />
                    {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 text-gray-700 flex items-center gap-2">
                    <FaShareAlt className="w-5 h-5" />
                    Share
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-2 p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaTruck className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Free Shipping</div>
                      <div className="text-sm text-gray-600">On orders over $50</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaRedo className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">30-Day Returns</div>
                      <div className="text-sm text-gray-600">Easy return policy</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-sm">2-Year Warranty</div>
                      <div className="text-sm text-gray-600">Manufacturer warranty</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCreditCard className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="font-medium text-sm">Secure Payment</div>
                      <div className="text-sm text-gray-600">SSL encrypted</div>
                    </div>
                  </div>
                </div>

                {/* SKU & Tags */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium ml-2">{product._id?.slice(-8) || "N/A"}</span>
                    </div>
                    {productTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {productTags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center gap-1">
                            <FaTag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {["Description", "Features", "Specifications", "Reviews", "Shipping"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 lg:p-8">
              {activeTab === "Description" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Product Description
                  </h3>
                  <p className="text-gray-700">
                    {product.description || product.shortDescription || "No detailed description available."}
                  </p>
                </div>
              )}

              {activeTab === "Features" && productFeatures.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Product Features
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {productFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "Specifications" && Object.keys(productSpecs).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(productSpecs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Reviews" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Customer Reviews
                    </h3>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Write a Review
                    </button>
                  </div>

                  {/* Average Rating */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-800">
                          {product.rating?.toFixed(1) || "4.5"}
                        </div>
                        <div className="flex justify-center mt-2">
                          {renderStars(product.rating)}
                        </div>
                        <div className="text-gray-600 mt-2">
                          {product.reviewCount || reviews.length} reviews
                        </div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3 mb-2">
                            <div className="w-12 text-gray-600">{stars} star</div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${(stars / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-gray-800">{review.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                          <button className="text-sm text-gray-500 hover:text-gray-700">
                            Helpful ({review.helpful})
                          </button>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Shipping" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Shipping Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FaTruck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Free Shipping</h4>
                        <p className="text-gray-600">Free standard shipping on orders over $50. Delivery within 3-5 business days.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaRedo className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Easy Returns</h4>
                        <p className="text-gray-600">30-day return policy. Items must be in original condition with all tags attached.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaShieldAlt className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Secure Packaging</h4>
                        <p className="text-gray-600">All items are carefully packaged to ensure they arrive in perfect condition.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                You May Also Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct._id}
                    onClick={() => navigate(`/product/${relatedProduct._id}`)}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={relatedProduct.mainImage || relatedProduct.images?.[0] || assets.shoe1}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = assets.shoe1;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 mb-2 truncate">{relatedProduct.name}</h4>
                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(relatedProduct.rating)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">
                          ${relatedProduct.price?.toFixed(2) || "0.00"}
                        </span>
                        <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          <FaShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;