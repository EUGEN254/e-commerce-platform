import React from "react";
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
      <div className="lg:w-1/2 w-full h-48 overflow-hidden relative flex items-center bg-transparent rounded-lg p-4 border border-transparent">
        {/* Limited Offers Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            LIMITED OFFERS
          </span>
        </div>

        <div className="flex animate-marquee space-x-6">
          {duplicatedShoes.map((shoe, index) => (
            <img
              key={index}
              src={shoe}
              alt={`Shoe ${index + 1}`}
              className="w-32 h-auto object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;