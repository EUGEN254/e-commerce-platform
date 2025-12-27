import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { findCounty, validateShippingInfo } from '../utils/shippingUtils';

export const useShipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: 'Kenya', // Default to Kenya
    postalCode: '',
    phone: '',
  });
  
  const [countyData, setCountyData] = useState(null);

  const handleShippingInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    const updatedInfo = { ...shippingInfo, [name]: value };
    
    setShippingInfo(updatedInfo);
    
    // Auto-validate county when city changes and country is Kenya
    if (name === 'city' && updatedInfo.country.toLowerCase() === 'kenya') {
      if (value.trim()) {
        const foundCounty = findCounty(value);
        if (foundCounty) {
          setCountyData(foundCounty);
          toast.success(`Shipping to ${foundCounty.county}: ${foundCounty.price} KES`);
        } else if (value.length > 2) {
          // Only show error after user has typed enough characters
          toast.error('County not recognized. Please check spelling.');
        }
      }
    }
  }, [shippingInfo]);

  const validateShipping = useCallback(() => {
    return validateShippingInfo(shippingInfo, toast);
  }, [shippingInfo]);

  const getShippingSuggestions = useCallback((input) => {
    if (!input || input.length < 2) return [];
    
    const normalizedInput = input.toLowerCase().trim();
    return Object.keys(COUNTY_SHIPPING_RATES)
      .filter(county => 
        county.toLowerCase().includes(normalizedInput) ||
        normalizedInput.includes(county.toLowerCase().slice(0, 3))
      )
      .slice(0, 5);
  }, []);

  return {
    shippingInfo,
    setShippingInfo,
    countyData,
    handleShippingInfoChange,
    validateShipping,
    getShippingSuggestions,
  };
};