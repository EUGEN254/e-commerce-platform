export const getDiscountBadgeColor = (discountType) => {
  switch (discountType) {
    case "percentage":
      return "bg-red-500";
    case "fixed":
      return "bg-blue-500";
    case "buy_x_get_y":
      return "bg-purple-500";
    case "free_shipping":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export const getTimeRemainingColor = (days) => {
  if (days <= 1) return "text-red-600 bg-red-50";
  if (days <= 3) return "text-orange-600 bg-orange-50";
  if (days <= 7) return "text-yellow-600 bg-yellow-50";
  return "text-green-600 bg-green-50";
};

export const getDiscountText = (offer) => {
  const { discountType, discountValue, discountPercentage, buyQuantity, getQuantity } = offer;
  
  switch (discountType) {
    case "percentage":
      return `-${discountPercentage || discountValue}%`;
    case "fixed":
      return `-$${discountValue}`;
    case "buy_x_get_y":
      return `Buy ${buyQuantity} Get ${getQuantity}`;
    case "free_shipping":
      return "Free Shipping";
    default:
      return "Special Offer";
  }
};

export const formatOfferEndDate = (endDate) => {
  if (!endDate) return "";
  
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = Math.abs(end - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Ends today";
  if (diffDays === 1) return "Ends tomorrow";
  if (diffDays <= 7) return `Ends in ${diffDays} days`;
  
  return `Ends on ${end.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })}`;
};

export const calculateSavings = (offer) => {
  if (!offer.originalPrice || !offer.offerPrice) return 0;
  return offer.originalPrice - offer.offerPrice;
};

export const calculateDiscountPercentage = (offer) => {
  if (!offer.originalPrice || !offer.offerPrice) return 0;
  return Math.round(((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100);
};