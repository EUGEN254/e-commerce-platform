import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { logError } from "../utils/errorHandler";

// Create Context
const OfferContext = createContext();

// Custom hook to use offer context
export const useOffers = () => {
  const context = useContext(OfferContext);
  if (!context) {
    throw new Error("useOffers must be used within an OfferProvider");
  }
  return context;
};

export const OfferProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    endingSoon: 0,
    featured: 0,
  });
 


  // Fetch all offers
  const fetchOffers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        limit: 50,
        active: true,
        ...params
      }).toString();
      
      const response = await axios.get(`${backendUrl}/api/limited-offers?${queryParams}`);
      
      if (response.data.success) {
        const offersData = response.data.data || response.data.offers || [];
        setOffers(offersData);
        
        // Calculate stats
        const endingSoon = offersData.filter(offer => 
          offer.daysRemaining <= 3
        ).length;
        
        const featured = offersData.filter(offer => 
          offer.isFeatured
        ).length;
        
        setStats({
          total: offersData.length,
          active: offersData.length,
          endingSoon,
          featured,
        });
        
        return offersData;
      }
      return [];
    } catch (err) {
      logError("fetchOffers", err);
      setError(err.response?.data?.message || "Failed to load offers");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch active offers (for header)
  const fetchActiveOffers = useCallback(async (limit = 10) => {
    try {
      const response = await axios.get(`${backendUrl}/api/limited-offers/active?limit=${limit}`);
      
      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (err) {
      logError("fetchActiveOffers", err);
      return [];
    }
  }, [backendUrl]);

  // Get a single offer by ID
  const getOfferById = useCallback(async (offerId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/limited-offers/${offerId}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      logError("getOfferById", err);
      return null;
    }
  }, [backendUrl]);

  // Track offer click (for analytics)
  const trackOfferClick = useCallback(async (offerId) => {
    try {
      await axios.put(`${backendUrl}/api/limited-offers/${offerId}/click`);
    } catch (err) {
      logError("trackOfferClick", err);
    }
  }, [backendUrl]);

  // Filter offers with multiple criteria
  const filterOffers = useCallback((filters = {}) => {
    let filtered = [...offers];

    const {
      search = "",
      category = "all",
      discountType = "all",
      timeRemaining = "all",
      featured = false,
      minPrice,
      maxPrice,
      sortBy = "priority",
    } = filters;

    // Search filter
    if (search) {
      filtered = filtered.filter(offer =>
        offer.title?.toLowerCase().includes(search.toLowerCase()) ||
        offer.description?.toLowerCase().includes(search.toLowerCase()) ||
        offer.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter(offer =>
        offer.categories?.some(cat => 
          cat.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // Discount type filter
    if (discountType !== "all") {
      filtered = filtered.filter(offer =>
        offer.discountType === discountType
      );
    }

    // Time remaining filter
    if (timeRemaining !== "all") {
      switch (timeRemaining) {
        case "today":
          filtered = filtered.filter(offer => offer.daysRemaining === 0);
          break;
        case "week":
          filtered = filtered.filter(offer => offer.daysRemaining <= 7);
          break;
        case "month":
          filtered = filtered.filter(offer => offer.daysRemaining <= 30);
          break;
      }
    }

    // Featured filter
    if (featured) {
      filtered = filtered.filter(offer => offer.isFeatured);
    }

    // Price range filter
    if (minPrice !== undefined) {
      filtered = filtered.filter(offer => offer.offerPrice >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter(offer => offer.offerPrice <= maxPrice);
    }

    // Sort offers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return (b.priority || 0) - (a.priority || 0);
        case "discount":
          return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        case "ending":
          return (a.daysRemaining || 99) - (b.daysRemaining || 99);
        case "price_low":
          return a.offerPrice - b.offerPrice;
        case "price_high":
          return b.offerPrice - a.offerPrice;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [offers]);

  // Get all unique categories from offers
  const getCategories = useCallback(() => {
    const categories = new Set();
    offers.forEach(offer => {
      offer.categories?.forEach(cat => categories.add(cat.toLowerCase()));
    });
    return ["all", ...Array.from(categories)];
  }, [offers]);

  // Refresh offers (useful for real-time updates)
  const refreshOffers = useCallback(async () => {
    return await fetchOffers();
  }, [fetchOffers]);

  // Get trending offers (most viewed/clicked)
  const getTrendingOffers = useCallback((limit = 5) => {
    return [...offers]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }, [offers]);

  // Get ending soon offers
  const getEndingSoonOffers = useCallback((limit = 5) => {
    return [...offers]
      .filter(offer => offer.daysRemaining <= 3)
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, limit);
  }, [offers]);

  // Initialize - fetch offers on mount
  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Context value
  const value = {
    offers,
    loading,
    error,
    stats,
    fetchOffers,
    fetchActiveOffers,
    getOfferById,
    trackOfferClick,
    filterOffers,
    getCategories,
    refreshOffers,
    getTrendingOffers,
    getEndingSoonOffers,
    setOffers, // For optimistic updates if needed
  };

  return (
    <OfferContext.Provider value={value}>
      {children}
    </OfferContext.Provider>
  );
};


