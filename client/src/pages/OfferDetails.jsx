import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Flame,
  Clock,
  Tag,
  ShoppingBag,
  Star,
  Shield,
  Check,
  Users,
  Eye,
  Share2,
  Heart,
  Truck,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";

import { toast } from "sonner";
import {
  getDiscountBadgeColor,
  getTimeRemainingColor,
  getDiscountText,
  formatOfferEndDate,
  calculateSavings,
} from "../utils/offerHelper";
import { Skeleton } from "../components/ui/Skeleton";
import { useOffers } from "../context/Offers";
import { useCart } from "../context/CartContext";

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOfferById, trackOfferClick, loading } = useOffers();
  const { addToCart } = useCart();
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setIsLoading(true);
        const offerData = await getOfferById(id);
        if (offerData) {
          setOffer(offerData);
          await trackOfferClick(id);
        } else {
          toast.error("Offer not found");
          navigate("/offers");
        }
      } catch (error) {
        console.error("Error fetching offer:", error);
        toast.error("Failed to load offer details");
        navigate("/offers");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOffer();
    }
  }, [id, getOfferById, trackOfferClick, navigate]);

  const handleShopNow = () => {
     const isExpired = new Date(offer.endDate) < new Date();
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
      inStock: !isExpired, // Use expired status as stock indicator
      stock: offer.usageLimit ? offer.usageLimit - (offer.usageCount || 0) : 1,
    };

    // Pass the formatted product data to addToCart
    addToCart(productData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: offer.title,
          text: offer.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8">
        <div className="text-center max-w-md">
          <Flame className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Offer Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The offer you're looking for doesn't exist or has expired.
          </p>
          <Button onClick={() => navigate("/offers")}>Browse All Offers</Button>
        </div>
      </div>
    );
  }

  const savings = calculateSavings(offer);
  const images = offer.images || [offer.image];
  const isExpired = new Date(offer.endDate) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate("/offers")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Offers
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={images[selectedImageIndex]}
                alt={offer.title}
                className="w-full h-96 object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {offer.isFeatured && (
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Featured Offer
                  </div>
                )}
                <div
                  className={`${getDiscountBadgeColor(
                    offer.discountType
                  )} text-white text-sm font-bold px-4 py-2 rounded-full`}
                >
                  {getDiscountText(offer)}
                </div>
                {isExpired && (
                  <div className="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-full">
                    Offer Expired
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${offer.title} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Categories */}
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
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {offer.title}
              </h1>
              <div
                className={`inline-flex items-center gap-2 ${getTimeRemainingColor(
                  offer.daysRemaining
                )} text-sm font-bold px-4 py-2 rounded-full`}
              >
                <Clock className="h-4 w-4" />
                {formatOfferEndDate(offer.endDate)}
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${offer.offerPrice?.toFixed(2) || "0.00"}
                </span>
                {offer.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ${offer.originalPrice?.toFixed(2)}
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      Save ${savings.toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {savings > 0 && (
                <div className="flex items-center gap-2 text-green-600">
                  <Tag className="h-4 w-4" />
                  <span className="font-medium">
                    You save {Math.round((savings / offer.originalPrice) * 100)}
                    % on this offer!
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Offer Details
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {offer.description}
              </p>
            </div>

            {/* Special Terms */}
            {offer.discountType === "buy_x_get_y" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Special Offer: Buy {offer.buyQuantity} Get{" "}
                      {offer.getQuantity} Free
                    </h4>
                    <p className="text-blue-800 text-sm">
                      Add {offer.buyQuantity} items to your cart and get{" "}
                      {offer.getQuantity} items free. Discount applies
                      automatically at checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Usage Stats */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {offer.views || 0}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                    <Eye className="h-3 w-3" />
                    Views
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {offer.usageCount || 0}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                    <Users className="h-3 w-3" />
                    Claimed
                  </div>
                </div>
                {offer.usageLimit && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {offer.usageLimit}
                      </div>
                      <div className="text-xs text-gray-600">Limit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {offer.usageLimit - (offer.usageCount || 0)}
                      </div>
                      <div className="text-xs text-gray-600">Left</div>
                    </div>
                  </>
                )}
              </div>

              {/* Progress Bar */}
              {offer.usageLimit && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Limited Stock Available</span>
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
            </div>

            {/* Guarantee & Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-green-600" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-blue-600" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span>Secure payment & SSL encryption</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleShopNow}
                disabled={isExpired}
                className="flex-1 py-3 text-lg"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {isExpired ? "Offer Expired" : "Shop This Offer"}
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    /* Add to wishlist */
                  }}
                  className="flex-1"
                  disabled={isExpired}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Related Products/Offers */}
            {offer.product && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() =>
                    navigate(`/product/${offer.product._id || offer.product}`)
                  }
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        View Full Product Details
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        See specifications, reviews, and more
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Offers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Similar Offers</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/offers")}
            className="text-primary"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Flame className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Explore more offers in our limited-time deals section</p>
          <Button
            onClick={() => navigate("/offers")}
            variant="outline"
            className="mt-4"
          >
            Browse All Offers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
