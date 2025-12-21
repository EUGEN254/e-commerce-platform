import React, { useState, useEffect } from "react";
import assets from "../assets/assets";

const BrandPartners = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Brand logos data - duplicate for seamless scrolling
  const brands = [
    {
      id: 1,
      name: "Nike",
      logo: assets.shoe1,
      category: "Sportswear"
    },
    {
      id: 2,
      name: "Apple",
      logo: assets.shoe1,
      category: "Electronics"
    },
    {
      id: 3,
      name: "Samsung",
      logo: assets.shoe1,
      category: "Electronics"
    },
    {
      id: 4,
      name: "Adidas",
      logo: assets.shoe1,
      category: "Sportswear"
    },
    {
      id: 5,
      name: "Sony",
      logo: assets.shoe1,
      category: "Electronics"
    },
    {
      id: 6,
      name: "Levi's",
      logo: assets.shoe1,
      category: "Fashion"
    },
    {
      id: 7,
      name: "Puma",
      logo: assets.shoe1,
      category: "Sportswear"
    },
    {
      id: 8,
      name: "Zara",
      logo: assets.shoe1,
      category: "Fashion"
    },
    {
      id: 9,
      name: "LG",
      logo: assets.shoe1,
      category: "Electronics"
    },
    {
      id: 10,
      name: "Under Armour",
      logo: assets.shoe1,
      category: "Sportswear"
    },
  ];

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  const handleBrandClick = (brandName) => {
    console.log(`Navigating to ${brandName} products`);
    // You can implement navigation logic here
  };

  return (
    <div className="mt-16 px-3 lg:px-2">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Trusted Brands
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Shop from the world's most popular and reliable brands
        </p>
      </div>

      {/* Auto-scrolling Brands Container */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* First Row - Moving Right to Left */}
        <div className="mb-6">
          <div 
            className={`flex gap-8 ${isHovered ? 'paused' : ''}`}
            style={{
              animation: 'marquee 30s linear infinite',
              animationPlayState: isHovered ? 'paused' : 'running'
            }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`row1-${brand.id}-${index}`}
                onClick={() => handleBrandClick(brand.name)}
                className="group flex-shrink-0 w-40 bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Brand Logo Container */}
                <div className="w-16 h-16 flex items-center justify-center mb-3 p-3 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors duration-300">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                
                {/* Brand Name */}
                <h3 className="font-semibold text-gray-800 text-center group-hover:text-indigo-600 transition-colors duration-300 text-sm">
                  {brand.name}
                </h3>
                
                {/* Brand Category */}
                <span className="text-xs text-gray-500 mt-1">
                  {brand.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Moving Left to Right (reverse direction) */}
        <div>
          <div 
            className={`flex gap-8 ${isHovered ? 'paused' : ''}`}
            style={{
              animation: 'marquee-reverse 35s linear infinite',
              animationPlayState: isHovered ? 'paused' : 'running'
            }}
          >
            {duplicatedBrands.slice().reverse().map((brand, index) => (
              <div
                key={`row2-${brand.id}-${index}`}
                onClick={() => handleBrandClick(brand.name)}
                className="group flex-shrink-0 w-36 bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Brand Logo Container */}
                <div className="w-14 h-14 flex items-center justify-center mb-2 p-2 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors duration-300">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                
                {/* Brand Name */}
                <h3 className="font-semibold text-gray-800 text-center group-hover:text-indigo-600 transition-colors duration-300 text-xs">
                  {brand.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pause notice */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          {isHovered ? 'Paused - Hover to pause' : 'Auto-scrolling - Hover to pause'}
        </p>
      </div>
    </div>
  );
};

export default BrandPartners;