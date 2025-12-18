import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const BrandPartners = () => {
  const scrollContainerRef = useRef(null);
  
  // Brand logos data - you can replace these with actual brand logos
  const brands = [
    {
      id: 1,
      name: "Nike",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
      category: "Sportswear"
    },
    {
      id: 2,
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      category: "Electronics"
    },
    {
      id: 3,
      name: "Samsung",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
      category: "Electronics"
    },
    {
      id: 4,
      name: "Adidas",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
      category: "Sportswear"
    },
    {
      id: 5,
      name: "Sony",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
      category: "Electronics"
    },
    {
      id: 6,
      name: "Levi's",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Levi%27s_logo.svg/1024px-Levi%27s_logo.svg.png",
      category: "Fashion"
    },
    {
      id: 7,
      name: "Puma",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Puma_logo.svg",
      category: "Sportswear"
    },
    {
      id: 8,
      name: "Zara",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg",
      category: "Fashion"
    },
    {
      id: 9,
      name: "LG",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg",
      category: "Electronics"
    },
    {
      id: 10,
      name: "Under Armour",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Under_armour_logo.svg",
      category: "Sportswear"
    },
    {
      id: 11,
      name: "H&M",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",
      category: "Fashion"
    },
    {
      id: 12,
      name: "Dell",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",
      category: "Electronics"
    },
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleBrandClick = (brandName) => {
    // Navigate to brand products or filter by brand
    console.log(`Navigating to ${brandName} products`);
    // You can implement navigation logic here
  };

  return (
    <div className="mt-16 px-3 lg:px-2">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Shop by Brand
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover products from the world's most trusted and popular brands
        </p>
      </div>

      {/* Brands Container with Scroll Buttons */}
      <div className="relative group">
        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
          aria-label="Scroll left"
        >
          <FaArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Brands Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide py-3 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.name)}
              className="group/brand flex-shrink-0 w-30 md:w-35 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Brand Logo Container */}
              <div className="w-14 h-14 md:w-24 md:h-15 flex items-center justify-center mb-4 p-4 bg-gray-50 rounded-xl group-hover/brand:bg-indigo-50 transition-colors duration-300">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover/brand:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=" + brand.name;
                  }}
                />
              </div>
              
              {/* Brand Name */}
              <h3 className="font-semibold text-gray-800 text-center group-hover/brand:text-indigo-600 transition-colors duration-300">
                {brand.name}
              </h3>
              
              {/* Brand Category */}
              <span className="text-sm text-gray-500 mt-1">
                {brand.category}
              </span>
              
              {/* View Products Link */}
              <div className="mt-3 text-xs text-indigo-600 opacity-0 group-hover/brand:opacity-100 transition-opacity duration-300">
                View Products →
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          aria-label="Scroll right"
        >
          <FaArrowRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Auto-scroll notice */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Scroll horizontally or click arrows to view more brands
        </p>
      </div>
      
    </div>
  );
};

export default BrandPartners;