import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Clock,
  Tag,
  Filter,
  Grid,
  List,
  ChevronDown,
  Search,
  X,
  Star,
  ShoppingBag,
  Check,
  AlertCircle,
  Calendar,
  Users,
  Zap,
  TrendingUp,
  Shield,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Button } from "../components/ui/button";

import {
  formatOfferEndDate,
  getDiscountBadgeColor,
  getTimeRemainingColor,
  getDiscountText,
} from "../utils/offerHelper";
import Price from "../components/ui/Price";
import { useOffers } from "../context/Offers";
import { SkeletonCard } from "../components/ui/Skeleton";
import { useCart } from "../context/CartContext";

// Offer Card Component
const OfferCard = ({ offer, onClick, onShopNow, viewMode = "grid" }) => {
  const{currSymbol} = useCart()
  if (viewMode === "grid") {
    return (
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer">
        {/* Image Container */}
        <div
          className="relative overflow-hidden h-48"
          onClick={() => onClick(offer)}
        >
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          <div
            className={`absolute top-4 right-4 ${getDiscountBadgeColor(
              offer.discountType
            )} text-white text-xs font-bold px-3 py-1.5 rounded-full`}
          >
            {getDiscountText(offer)}
          </div>

          {/* Featured Badge */}
          {offer.isFeatured && (
            <div className="absolute top-4 left-4 bg-linear-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Star className="h-3 w-3" />
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-3">
            {offer.categories?.slice(0, 2).map((cat, index) => (
              <span
                key={index}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3
            className="font-bold text-lg mb-2 line-clamp-1 hover:text-primary transition-colors"
            onClick={() => onClick(offer)}
          >
            {offer.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {offer.shortDescription || offer.description}
          </p>

          {/* Price & Time */}
          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-center justify-between">
                <div>
                  <Price amount={offer.offerPrice} originalAmount={offer.originalPrice} />
                </div>

              {/* Time Remaining */}
              <div
                className={`text-xs font-medium px-3 py-1 rounded-full ${getTimeRemainingColor(
                  offer.daysRemaining
                )}`}
              >
                <Clock className="inline h-3 w-3 mr-1" />
                {formatOfferEndDate(offer.endDate)}
              </div>
            </div>

            {/* Progress Bar (if usage limit exists) */}
            {offer.usageLimit && (
              <div className="pt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>
                    Sold: {offer.usageCount || 0}/{offer.usageLimit}
                  </span>
                  <span>
                    {Math.round(
                      ((offer.usageCount || 0) / offer.usageLimit) * 100
                    )}
                    % claimed
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((offer.usageCount || 0) / offer.usageLimit) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={() => onShopNow(offer)} className="flex-1">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop Now
              </Button>
              <Button
                variant="outline"
                onClick={() => onClick(offer)}
                className="px-4"
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div
          className="md:w-1/3 h-48 md:h-auto relative overflow-hidden cursor-pointer"
          onClick={() => onClick(offer)}
        >
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {offer.isFeatured && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 w-fit">
                <Star className="h-3 w-3" />
                Featured
              </div>
            )}
            <div
              className={`${getDiscountBadgeColor(
                offer.discountType
              )} text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit`}
            >
              {getDiscountText(offer)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h3
                  className="font-bold text-xl hover:text-primary transition-colors cursor-pointer"
                  onClick={() => onClick(offer)}
                >
                  {offer.title}
                </h3>
                <div
                  className={`text-sm font-medium px-3 py-1 rounded-full ${getTimeRemainingColor(
                    offer.daysRemaining
                  )}`}
                >
                  <Clock className="inline h-3 w-3 mr-1" />
                  {formatOfferEndDate(offer.endDate)}
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-3">
                {offer.categories?.map((cat, index) => (
                  <span
                    key={index}
                    className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <p className="text-gray-600 line-clamp-2">{offer.description}</p>
            </div>

            {/* Price & Stats */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Price amount={offer.offerPrice} originalAmount={offer.originalPrice} className="text-3xl" />
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                  {offer.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{offer.views} views</span>
                    </div>
                  )}
                  {offer.usageCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{offer.usageCount} claimed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={() => onShopNow(offer)} className="flex-1">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop Now
                </Button>
                <Button variant="outline" onClick={() => onClick(offer)}>
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    /* Add to wishlist */
                  }}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Offer Modal Component
const OfferModal = ({ offer, onClose, onShopNow }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const{currSymbol} = useCart()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>

          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side - Image */}
            <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {offer.isFeatured && (
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Featured Offer
                  </div>
                )}
                <div
                  className={`${getDiscountBadgeColor(
                    offer.discountType
                  )} text-white text-sm font-bold px-4 py-2 rounded-full`}
                >
                  {offer.discountType === "percentage"
                    ? `SAVE ${currSymbol} ${offer.discountPercentage || offer.discountValue}%`
                    : offer.discountType === "fixed"
                    ? `SAVE ${currSymbol} ${offer.discountValue}`
                    : offer.discountType === "buy_x_get_y"
                    ? "BUY X GET Y FREE"
                    : "FREE SHIPPING"}
                </div>
              </div>

              {/* Time Remaining */}
              <div
                className={`absolute bottom-4 left-4 ${getTimeRemainingColor(
                  offer.daysRemaining
                )} text-sm font-bold px-4 py-2 rounded-full`}
              >
                <Clock className="inline h-4 w-4 mr-2" />
                {formatOfferEndDate(offer.endDate)}
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
              <div className="space-y-6">
                {/* Title & Categories */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {offer.categories?.map((cat, index) => (
                      <span
                        key={index}
                        className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {offer.title}
                  </h2>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    {currSymbol} {offer.offerPrice?.toFixed(2) || "0.00"}
                  </span>
                  {offer.originalPrice && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        {currSymbol} {offer.originalPrice?.toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        Save {currSymbol}
                        {(offer.originalPrice - offer.offerPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Offer Details
                  </h3>
                  <div className="text-gray-600 space-y-3">
                    <p className={showFullDescription ? "" : "line-clamp-3"}>
                      {offer.description}
                    </p>
                    {offer.description.length > 200 && (
                      <button
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        {showFullDescription ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Terms & Conditions */}
                {offer.discountType === "buy_x_get_y" && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Buy {offer.buyQuantity} Get {offer.getQuantity} Free
                    </h4>
                    <p className="text-blue-800 text-sm">
                      Purchase {offer.buyQuantity} items and get{" "}
                      {offer.getQuantity} items free. Offer applies
                      automatically at checkout.
                    </p>
                  </div>
                )}

                {/* Usage Stats */}
                <div className="border-t border-b border-gray-200 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {offer.usageCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Claimed Offers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {offer.views || 0}
                      </div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {offer.usageLimit && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Limited Offer</span>
                        <span>
                          {offer.usageCount || 0}/{offer.usageLimit} claimed
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                          style={{
                            width: `${Math.min(
                              ((offer.usageCount || 0) / offer.usageLimit) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guarantee */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>
                    30-day money-back guarantee • Secure checkout • 24/7 support
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => {
                      onShopNow(offer);
                      onClose();
                    }}
                    className="flex-1 py-3 text-lg"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Shop This Offer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      /* Add to wishlist */
                    }}
                    className="py-3"
                  >
                    <Star className="h-5 w-5 mr-2" />
                    Save Offer
                  </Button>
                </div>

                {/* Share */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Share this offer with friends
                  </p>
                  <div className="flex justify-center gap-2 mt-2">
                    {/* Add social sharing buttons here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Offers Component
const Offers = () => {
  const navigate = useNavigate();
  const {
    offers,
    loading,
    error,
    stats,
    filterOffers,
    getCategories,
    trackOfferClick,
    refreshOffers,
  } = useOffers();

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    discountType: "all",
    timeRemaining: "all",
    featured: false,
    sortBy: "priority",
  });

  // UI States
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const{addToCart} = useCart()

  // Get categories from context
  const categories = getCategories();

  // Discount types
  const discountTypes = [
    "all",
    "percentage",
    "fixed",
    "buy_x_get_y",
    "free_shipping",
  ];

  // Sort options
  const sortOptions = [
    { value: "priority", label: "Featured First", icon: TrendingUp },
    { value: "discount", label: "Highest Discount", icon: Tag },
    { value: "ending", label: "Ending Soon", icon: Clock },
    { value: "price_low", label: "Price: Low to High", icon: ArrowRight },
    { value: "price_high", label: "Price: High to Low", icon: ArrowRight },
    { value: "newest", label: "Newest First", icon: Calendar },
  ];

  // Time remaining options
  const timeRemainingOptions = [
    { value: "all", label: "All Offers" },
    { value: "today", label: "Ending Today" },
    { value: "week", label: "Ending This Week" },
    { value: "month", label: "Ending This Month" },
  ];

  // Apply filters when filters or offers change
  useEffect(() => {
    if (offers.length > 0) {
      const filtered = filterOffers(filters);
      setFilteredOffers(filtered);
    }
  }, [offers, filters, filterOffers]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      discountType: "all",
      timeRemaining: "all",
      featured: false,
      sortBy: "priority",
    });
  };

  const handleOfferClick = async (offer) => {
    setSelectedOffer(offer);
    setShowOfferModal(true);
    await trackOfferClick(offer._id);
  };

 const handleShopNow = (offer) => {
  // Create a product object from the offer
  const productData = {
    id: offer._id || offer.id,
    name: offer.title,
    price: offer.offerPrice || offer.price,
    originalPrice: offer.originalPrice,
    image: offer.image || (offer.images && offer.images[0]),
    description: offer.description,
    category: offer.categories?.[0] || "Limited Offer",
    discount: offer.discountType,
    discountValue: offer.discountValue || offer.discount,
    isLimitedOffer: true,
    offerId: offer._id,
    // Add any other required fields from your product structure
    brand: offer.brand || "Limited Time Offer",
    inStock: true, // You'll need to calculate this from offer data
    stock: offer.usageLimit ? offer.usageLimit - (offer.usageCount || 0) : 1,
  };

  // Pass the formatted product data to addToCart
  addToCart(productData);

  // Optional: Navigate to cart or show confirmation
  toast.success(`${offer.title} added to cart!`);
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Limited Time Offers
                </h1>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl">
                Don't miss out on exclusive deals and discounts. Shop our
                limited-time offers before they're gone!
              </p>
            </div>
            <div className="lg:w-1/3 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.active}
                  </div>
                  <div className="text-sm text-gray-600">Active Offers</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {stats.endingSoon}
                  </div>
                  <div className="text-sm text-gray-600">Ending Soon</div>
                </div>
              </div>
              <Button onClick={() => navigate("/shop")} className="w-full">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search offers..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* View Toggle and Sort */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-gray-600"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-gray-600"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {Object.values(filters).some(
                  (v) => v !== "all" && v !== "" && v !== false
                ) && <span className="h-2 w-2 bg-primary rounded-full"></span>}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {Object.entries(filters).some(
            ([key, value]) =>
              key !== "sortBy" &&
              value !== "all" &&
              value !== "" &&
              value !== false
          ) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.category !== "all" && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  Category: {filters.category}
                  <button onClick={() => handleFilterChange("category", "all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.discountType !== "all" && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Type: {filters.discountType}
                  <button
                    onClick={() => handleFilterChange("discountType", "all")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.timeRemaining !== "all" && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                  {
                    timeRemainingOptions.find(
                      (t) => t.value === filters.timeRemaining
                    )?.label
                  }
                  <button
                    onClick={() => handleFilterChange("timeRemaining", "all")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.featured && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  Featured Only
                  <button onClick={() => handleFilterChange("featured", false)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.search && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  Search: "{filters.search}"
                  <button onClick={() => handleFilterChange("search", "")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filter Offers</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) =>
                          handleFilterChange("category", e.target.value)
                        }
                        className="text-primary focus:ring-primary"
                      />
                      <span className="capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type
                </label>
                <div className="space-y-2">
                  {discountTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="discountType"
                        value={type}
                        checked={filters.discountType === type}
                        onChange={(e) =>
                          handleFilterChange("discountType", e.target.value)
                        }
                        className="text-primary focus:ring-primary"
                      />
                      <span className="capitalize">
                        {type.replace(/_/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Remaining */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Remaining
                </label>
                <div className="space-y-2">
                  {timeRemainingOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="timeRemaining"
                        value={option.value}
                        checked={filters.timeRemaining === option.value}
                        onChange={(e) =>
                          handleFilterChange("timeRemaining", e.target.value)
                        }
                        className="text-primary focus:ring-primary"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Filters
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) =>
                        handleFilterChange("featured", e.target.checked)
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span>Featured Offers Only</span>
                    {filters.featured && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
              <Button onClick={() => setShowFilters(false)} className="px-6">
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredOffers.length}</span> of{" "}
            <span className="font-semibold">{stats.total}</span> offers
            {filters.search && ` for "${filters.search}"`}
          </p>
          <button
            onClick={refreshOffers}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Refresh Offers
          </button>
        </div>

        {/* Offers Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error && filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
            <Button onClick={refreshOffers} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No offers found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer._id}
                offer={offer}
                onClick={handleOfferClick}
                onShopNow={handleShopNow}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer._id}
                offer={offer}
                onClick={handleOfferClick}
                onShopNow={handleShopNow}
                viewMode="list"
              />
            ))}
          </div>
        )}

        {/* Pagination (if needed) */}
        {filteredOffers.length > 12 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                Previous
              </button>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className={`px-4 py-2 rounded-lg ${
                    num === 1
                      ? "bg-primary text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Offer Details Modal */}
      {showOfferModal && selectedOffer && (
        <OfferModal
          offer={selectedOffer}
          onClose={() => setShowOfferModal(false)}
          onShopNow={() => handleShopNow(selectedOffer)}
        />
      )}
    </div>
  );
};

export default Offers;
