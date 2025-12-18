import React, { useState, useEffect } from "react";
import assets from "../assets/assets";

const Header = () => {
  const shoes = [
    assets.shoe1,
    assets.shoe1,
    assets.shoe1,
    assets.shoe1,
    assets.shoe1,
    assets.shoe1,
    assets.shoe1,
    assets.shoe1,
  ];

  // State for controlling animation
  const [isHovered, setIsHovered] = useState(false);
  
  // Duplicate the array for seamless looping
  const duplicatedShoes = [...shoes, ...shoes];

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-start mt-2 px-5 lg:px-20 border-2 border-gray-300 rounded-xl p-6 lg:p-10 mx-4">
      {/* Text Section */}
      <div className="lg:w-1/2 flex flex-col justify-center items-start w-full">
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
          <button className="btn-primary">Shop Now</button>
          <button className="btn-secondary">Explore More</button>
        </div>
      </div>

      {/* Moving Shoes Section */}
      <div 
        className="lg:w-1/2 w-full h-48 overflow-hidden relative flex items-center  rounded-2xl p-4 border border-transparent "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Limited Offers Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            🔥 LIMITED OFFERS
          </span>
        </div>

        {/* Animated Images Container */}
        <div className="relative w-full overflow-hidden">
          {/* First Row - Moving Right to Left */}
          <div 
            className={`flex space-x-8 mb-4 ${isHovered ? 'paused' : ''}`}
            style={{
              animation: 'marquee 25s linear infinite',
              animationPlayState: isHovered ? 'paused' : 'running'
            }}
          >
            {duplicatedShoes.map((shoe, index) => (
              <div 
                key={`row1-${index}`} 
                className="group relative flex-shrink-0 transform transition-all duration-300 hover:scale-110 hover:z-10"
              >
                <img
                  src={shoe}
                  alt={`Product ${index + 1}`}
                  className="w-28 h-28 object-contain filter drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Second Row - Moving Left to Right (reverse direction) */}
          <div 
            className={`flex space-x-8 ${isHovered ? 'paused' : ''}`}
            style={{
              animation: 'marquee-reverse 30s linear infinite',
              animationPlayState: isHovered ? 'paused' : 'running'
            }}
          >
            {duplicatedShoes.map((shoe, index) => (
              <div 
                key={`row2-${index}`} 
                className="group relative flex-shrink-0 transform transition-all duration-300 hover:scale-110 hover:z-10"
              >
                <img
                  src={shoe}
                  alt={`Product ${index + 9}`}
                  className="w-24 h-24 object-contain filter drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default Header;