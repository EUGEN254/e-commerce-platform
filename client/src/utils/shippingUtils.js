// County definitions with shipping prices
export const COUNTY_SHIPPING_RATES = {
  // NAIROBI REGION
  'Nairobi': { price: 250, zone: 'Nairobi Metropolitan' },
  
  // CENTRAL REGION
  'Kiambu': { price: 280, zone: 'Central' },
  'Murang\'a': { price: 300, zone: 'Central' },
  'Nyeri': { price: 320, zone: 'Central' },
  'Kirinyaga': { price: 310, zone: 'Central' },
  'Nyandarua': { price: 340, zone: 'Central' },
  'Meru': { price: 380, zone: 'Eastern' },
  'Tharaka-Nithi': { price: 400, zone: 'Eastern' },
  'Embu': { price: 350, zone: 'Eastern' },
  
  // COAST REGION
  'Mombasa': { price: 450, zone: 'Coastal' },
  'Kilifi': { price: 420, zone: 'Coastal' },
  'Kwale': { price: 460, zone: 'Coastal' },
  'Lamu': { price: 550, zone: 'Coastal' },
  'Tana River': { price: 500, zone: 'Coastal' },
  'Taita-Taveta': { price: 400, zone: 'Coastal' },
  
  // EASTERN REGION
  'Machakos': { price: 300, zone: 'Eastern' },
  'Makueni': { price: 320, zone: 'Eastern' },
  'Kitui': { price: 350, zone: 'Eastern' },
  'Marsabit': { price: 620, zone: 'Northern' },
  'Isiolo': { price: 520, zone: 'Northern' },
  
  // NORTH EASTERN REGION
  'Garissa': { price: 550, zone: 'North Eastern' },
  'Wajir': { price: 650, zone: 'North Eastern' },
  'Mandera': { price: 700, zone: 'North Eastern' },
  
  // NYANZA REGION
  'Kisumu': { price: 380, zone: 'Western' },
  'Siaya': { price: 400, zone: 'Western' },
  'Homa Bay': { price: 420, zone: 'Western' },
  'Migori': { price: 440, zone: 'Western' },
  'Kisii': { price: 390, zone: 'Western' },
  'Nyamira': { price: 400, zone: 'Western' },
  
  // RIFT VALLEY REGION
  'Nakuru': { price: 320, zone: 'Rift Valley' },
  'Kericho': { price: 350, zone: 'Rift Valley' },
  'Bomet': { price: 370, zone: 'Rift Valley' },
  'Narok': { price: 380, zone: 'Rift Valley' },
  'Kajiado': { price: 300, zone: 'Rift Valley' },
  'Baringo': { price: 400, zone: 'Rift Valley' },
  'Elgeyo-Marakwet': { price: 420, zone: 'Rift Valley' },
  'Laikipia': { price: 350, zone: 'Rift Valley' },
  'Nandi': { price: 360, zone: 'Rift Valley' },
  'Samburu': { price: 520, zone: 'Northern' },
  'Trans-Nzoia': { price: 410, zone: 'Rift Valley' },
  'Turkana': { price: 600, zone: 'Northern' },
  'Uasin Gishu': { price: 380, zone: 'Rift Valley' },
  'West Pokot': { price: 480, zone: 'Rift Valley' },
  
  // WESTERN REGION
  'Kakamega': { price: 400, zone: 'Western' },
  'Vihiga': { price: 390, zone: 'Western' },
  'Busia': { price: 420, zone: 'Western' },
  'Bungoma': { price: 410, zone: 'Western' },
  
  // Add major towns/cities for better user experience
  'Eldoret': { price: 380, zone: 'Rift Valley' }, // Major town in Uasin Gishu
  'Thika': { price: 280, zone: 'Central' }, // Major town in Kiambu
  'Kitale': { price: 410, zone: 'Rift Valley' }, // Major town in Trans-Nzoia
  'Malindi': { price: 460, zone: 'Coastal' }, // Major town in Kilifi
  'Naivasha': { price: 310, zone: 'Rift Valley' }, // Major town in Nakuru
  'Nanyuki': { price: 340, zone: 'Central' }, // Major town in Laikipia
  'Kerugoya': { price: 310, zone: 'Central' }, // Major town in Kirinyaga
  'Karatina': { price: 320, zone: 'Central' }, // Major town in Nyeri
  'Kapsabet': { price: 360, zone: 'Rift Valley' }, // Major town in Nandi
  'Lodwar': { price: 600, zone: 'Northern' }, // Major town in Turkana
  'Moyale': { price: 700, zone: 'Northern' }, // Border town in Marsabit
};


// Function to normalize county name (for fuzzy matching)
const normalizeCountyName = (countyName) => {
  if (!countyName) return '';
  
  return countyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
};

// Find county with fuzzy matching
export const findCounty = (userInput) => {
  if (!userInput) return null;
  
  const normalizedInput = normalizeCountyName(userInput);
  
  // Exact match
  for (const [county, data] of Object.entries(COUNTY_SHIPPING_RATES)) {
    if (normalizeCountyName(county) === normalizedInput) {
      return { county, ...data };
    }
  }
  
  // Partial match
  for (const [county, data] of Object.entries(COUNTY_SHIPPING_RATES)) {
    const normalizedCounty = normalizeCountyName(county);
    
    // Check if input contains county or county contains input
    if (normalizedCounty.includes(normalizedInput) || 
        normalizedInput.includes(normalizedCounty)) {
      return { county, ...data };
    }
  }
  
  return null;
};

// Validate shipping info and return shipping cost
export const validateShippingInfo = (shippingInfo, toast) => {
  const { city, country } = shippingInfo;
  
  // Basic validation
  if (!city || !country) {
    toast.error('Please provide city and country');
    return { valid: false, shippingCost: 0 };
  }
  
  // For Kenya, validate county
  if (country.toLowerCase() === 'kenya') {
    const countyData = findCounty(city);
    
    if (!countyData) {
      // Suggest similar counties
      const suggestions = Object.keys(COUNTY_SHIPPING_RATES)
        .filter(county => 
          normalizeCountyName(county).includes(normalizeCountyName(city).slice(0, 3)) ||
          normalizeCountyName(city).includes(normalizeCountyName(county).slice(0, 3))
        )
        .slice(0, 3);
      
      toast.error(`County "${city}" not found. Did you mean: ${suggestions.join(', ')}?`);
      return { valid: false, shippingCost: 0 };
    }
    
    return { 
      valid: true, 
      shippingCost: countyData.price,
      countyData 
    };
  }
  
  // For international shipping (flat rate or different calculation)
  return {
    valid: true,
    shippingCost: 1000, // Flat international rate in KES
    countyData: null
  };
};

// Calculate shipping based on subtotal (free shipping over certain amount)
export const calculateShipping = (subtotal, county) => {
  const MIN_FREE_SHIPPING = 5000; // Free shipping for orders over 5000 KES
  
  if (subtotal >= MIN_FREE_SHIPPING) {
    return 0;
  }
  
  if (county) {
    const countyData = findCounty(county);
    return countyData ? countyData.price : 300; // Default shipping
  }
  
  return 300; // Default shipping cost
};