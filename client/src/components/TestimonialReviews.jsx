import React, { useState, useEffect } from "react";
import { 
  FaQuoteLeft, 
  FaQuoteRight, 
  FaStar, 
  FaChevronLeft, 
  FaChevronRight,
  FaUserCircle 
} from "react-icons/fa";

const TestimonialReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Frequent Shopper",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      date: "2 days ago",
      content: "Absolutely love this platform! The quality of products is exceptional and delivery is always on time. My go-to for all fashion needs!",
      product: "Summer Dress Collection",
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Tech Enthusiast",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      rating: 4,
      date: "1 week ago",
      content: "The electronics selection here is fantastic. Bought a laptop and got it delivered within 24 hours. Customer service was incredibly helpful!",
      product: "Gaming Laptop",
      verified: true
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Home Decor Blogger",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 5,
      date: "3 days ago",
      content: "Beautiful home decor items at reasonable prices. The quality exceeds my expectations every single time. Highly recommended!",
      product: "Living Room Set",
      verified: true
    },
    {
      id: 4,
      name: "David Park",
      role: "Sneaker Collector",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
      date: "1 month ago",
      content: "As a sneakerhead, I'm impressed with the authentic collection and fair pricing. Found some rare pairs I couldn't find elsewhere!",
      product: "Limited Edition Sneakers",
      verified: true
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Busy Mom",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      date: "2 weeks ago",
      content: "Perfect for busy parents! Easy navigation, quick checkout, and everything arrives perfectly packaged. Saved me so much time!",
      product: "Kids Clothing Bundle",
      verified: true
    },
    {
      id: 6,
      name: "Robert Wilson",
      role: "First-time Buyer",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      date: "Yesterday",
      content: "Was hesitant to shop online, but this platform changed my mind. The return policy is hassle-free and products are exactly as described.",
      product: "Wireless Earbuds",
      verified: true
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="mt-20 px-4 lg:px-4 py-5 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <FaQuoteLeft className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-1xl md:text-2xl font-bold text-gray-800">
            Customer Stories
          </h2>
        </div>
        <p className="text-gray-600 max-w-xl mx-auto text-sm">
          Join thousands of satisfied customers who love shopping with us
        </p>
      </div>

      {/* Main Carousel */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 p-3 md:p-4 bg-white rounded-full shadow-xl hover:shadow-2xl hover:bg-indigo-50 transition-all duration-300 border border-gray-200"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="w-2 h-2 md:w-3 md:h-3 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 p-3 md:p-4 bg-white rounded-full shadow-xl hover:shadow-2xl hover:bg-indigo-50 transition-all duration-300 border border-gray-200"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="w-3 h-3 md:w-3 md:h-3 text-gray-700" />
          </button>

          {/* Testimonial Cards Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-2xl p-3 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex">
                        {renderStars(testimonial.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{testimonial.date}</span>
                      {testimonial.verified && (
                        <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    {/* Quote Content */}
                    <div className="relative mb-8">
                      <FaQuoteLeft className="absolute -top-2 -left-3 w-4 h-4 text-indigo-200" />
                      <p className="text-gray-700 text-sm md:text-xl italic leading-relaxed pl-4">
                        "{testimonial.content}"
                      </p>
                      <FaQuoteRight className="absolute -bottom-2 -right-3 w-4 h-4 text-indigo-200" />
                    </div>

                    {/* Product Mentioned */}
                    {testimonial.product && (
                      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Purchased:</span>
                        <p className="font-medium text-gray-800">{testimonial.product}</p>
                      </div>
                    )}

                    {/* Customer Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full border-2 border-white shadow"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentElement.innerHTML = 
                              `<div class="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                                <FaUserCircle class="w-10 h-10 text-indigo-400" />
                              </div>`;
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-indigo-600 w-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Additional Testimonials Grid (for larger screens) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-12">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className={`bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 ${
                index === 1 ? "transform translate-y-4" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-xs text-gray-500 ml-auto">{testimonial.date}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = 
                      `<div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FaUserCircle class="w-6 h-6 text-indigo-400" />
                      </div>`;
                  }}
                />
                <div>
                  <h5 className="font-semibold text-gray-800 text-sm">{testimonial.name}</h5>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-indigo-600">4.8/5</div>
            <div className="text-gray-600 text-sm">Average Rating</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-indigo-600">10K+</div>
            <div className="text-gray-600 text-sm">Happy Customers</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-indigo-600">98%</div>
            <div className="text-gray-600 text-sm">Recommend Us</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-indigo-600">24/7</div>
            <div className="text-gray-600 text-sm">Support Available</div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Share Your Experience
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Have you shopped with us? We'd love to hear your story!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialReviews;