import React, { useState } from "react";
import assets from "../assets/assets";
import { Flame } from 'lucide-react';

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Your shoes/images
  const shoes = [
    assets.shoe1,
    assets.wireless,
    assets.teashirt,
    assets.laptopbag,
    assets.cofeemaker
  ];
  
  // Duplicate for seamless scrolling
  const duplicatedShoes = [...shoes, ...shoes, ...shoes, ...shoes];

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-start mt-2 px-5 lg:px-20 border-2 border-gray-300 rounded-xl p-6 lg:p-10 mx-4">
      {/* Text Section - Left side */}
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

      {/* Limited Offers Carousel - Right side */}
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

          {/* Horizontal Scrolling Images - Like LimitedOffersCarousel */}
          <div className="relative overflow-hidden h-40">
            <div 
              className={`flex gap-6 ${isHovered ? 'paused' : ''}`}
              style={{
                animation: 'marquee 20s linear infinite',
                animationPlayState: isHovered ? 'paused' : 'running',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {duplicatedShoes.map((shoe, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={shoe}
                      alt={`Limited Offer ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Price Overlay */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                      ${29.99 + (index % 5) * 20}
                    </div>
                    {/* Discount Badge */}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{15 + (index % 3) * 10}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-4 text-center">
            <button className="text-primary text-sm font-medium hover:underline">
              View All Limited Offers →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;