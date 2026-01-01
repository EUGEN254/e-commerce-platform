import React, { useState } from "react";
import { Flame } from 'lucide-react';
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton } from "./ui/Skeleton";
import { getTimeRemainingColor } from "../utils/offerHelper";
import Price from "./ui/Price";
import { useOffers } from "../context/Offers";

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { 
    trackOfferClick, 
    loading: offersLoading, 
    offers: contextOffers 
  } = useOffers(); // Remove fetchActiveOffers from destructuring
  
  const navigate = useNavigate();
  
  // Use context offers directly (limited to 10 for the header)
  const offers = contextOffers.slice(0, 10);
  const loading = offersLoading && contextOffers.length === 0;
  
  // Duplicate offers for seamless scrolling
  const duplicatedOffers = offers.length > 0 
    ? [...offers, ...offers, ...offers] 
    : [];

  const handleOfferClick = async (offer) => {
    await trackOfferClick(offer._id);
    navigate(`/offers/${offer._id}`);
  };

  const handleViewAllOffers = () => {
    navigate("/offers");
  };

  const calculateDiscount = (offer) => {
    if (!offer.originalPrice || !offer.offerPrice) return 0;
    return Math.round(((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100);
  };

  const hasOffers = offers.length > 0;
  const showOffersSection = hasOffers || loading;

  return (
    <div className={`flex flex-col ${showOffersSection ? 'lg:flex-row' : 'flex-col items-center justify-center'} gap-8 lg:gap-10 items-center lg:items-start mt-2 px-5 lg:px-20 border-2 border-gray-300 rounded-xl p-6 lg:p-10 mx-4`}>
      {/* Text Section */}
      <div className={`${showOffersSection ? 'lg:w-1/2' : 'w-full text-center max-w-3xl mx-auto'} flex flex-col justify-center items-start w-full`}>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          Discover Everything <br />
          You Love in One Place
        </h1>
        <p className="my-4 text-gray-600 text-sm lg:text-base max-w-xl">
          From fashion and electronics to home essentials and more, explore our
          wide range of products designed to bring convenience, style, and joy
          to your life.
        </p>
        <div className="flex flex-row gap-3 lg:gap-4">
          <Button 
            onClick={() => navigate("/shop")}
            className="btn-primary"
          >
            Shop Now
          </Button>
          {!showOffersSection && (
            <Button 
              onClick={() => navigate("/categories")}
              variant="outline"
            >
              Browse Categories
            </Button>
          )}
        </div>
      </div>

      {/* Limited Offers Carousel */}
      {showOffersSection && (
        <div className="lg:w-1/2 w-full">
          <div 
            className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 h-full overflow-hidden relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Limited Offers Tag */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 text-primary">
                <Flame className="h-5 w-5" />
                <span className="font-display font-bold text-lg">LIMITED OFFERS</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>

            {/* Horizontal Scrolling Images */}
            <div className="relative overflow-hidden h-40">
              {loading ? (
                <div className="flex gap-6">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-32 h-32 rounded-xl" />
                  ))}
                </div>
              ) : !hasOffers ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Flame className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No active limited offers at the moment</p>
                  <p className="text-gray-400 text-sm mt-1">Check back soon for amazing deals!</p>
                </div>
              ) : (
                <div 
                  className={`flex gap-6 ${isHovered ? 'paused' : ''}`}
                  style={{
                    animation: 'marquee 25s linear infinite',
                    animationPlayState: isHovered ? 'paused' : 'running',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  {duplicatedOffers.map((offer, index) => {
                    const discountPercentage = calculateDiscount(offer);
                    
                    return (
                      <motion.div
                        key={`${offer._id}-${index}`}
                        className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group cursor-pointer"
                        onClick={() => handleOfferClick(offer)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative w-full h-full overflow-hidden">
                          <img
                            src={offer.image}
                            alt={offer.title || `Limited Offer ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                              <Price amount={offer.offerPrice} className="text-xs font-bold" />
                          </div>
                          
                          {discountPercentage > 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{discountPercentage}%
                            </div>
                          )}
                          
                          {offer.daysRemaining !== undefined && (
                            <div className={`absolute top-2 left-2 ${getTimeRemainingColor(offer.daysRemaining)} text-white text-[10px] font-bold px-2 py-1 rounded`}>
                              {offer.daysRemaining <= 0 ? "Ends today" : `${offer.daysRemaining}d left`}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Call to Action */}
            {hasOffers && (
              <div className="mt-4 text-center">
                <button 
                  onClick={handleViewAllOffers}
                  className="text-primary text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  View All Limited Offers
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;