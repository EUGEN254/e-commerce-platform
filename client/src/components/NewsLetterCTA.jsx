import React, { useState } from "react";
import { 
  FaEnvelope, 
  FaCheck, 
  FaGift, 
  FaShieldAlt,
  FaBell,
  FaRocket,
  FaPaperPlane 
} from "react-icons/fa";

const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, you would make an API call here
      console.log("Subscribed email:", email);
      
      // Show success state
      setIsSubscribed(true);
      setEmail("");
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <FaGift className="w-5 h-5" />,
      text: "Exclusive discounts & offers",
      color: "text-pink-500 bg-pink-50"
    },
    {
      icon: <FaBell className="w-5 h-5" />,
      text: "Early access to new arrivals",
      color: "text-blue-500 bg-blue-50"
    },
    {
      icon: <FaRocket className="w-5 h-5" />,
      text: "VIP member-only sales",
      color: "text-purple-500 bg-purple-50"
    },
    {
      icon: <FaShieldAlt className="w-5 h-5" />,
      text: "No spam, unsubscribe anytime",
      color: "text-green-500 bg-green-50"
    }
  ];

  return (
    <div className="mt-20 px-5 lg:px-5">
      {/* Decorative Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative z-10 py-12 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              {/* Left Content */}
              <div className="lg:w-1/2 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                    <FaEnvelope className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    Subscribe & Save
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Stay in the
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                    Fashion Loop
                  </span>
                </h2>
                
                <p className="text-lg text-white/90 mb-8 max-w-xl">
                  Join our newsletter and be the first to know about exclusive deals, 
                  new arrivals, and style tips. Subscribers get 15% off their first order!
                </p>

                {/* Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${benefit.color}`}>
                        {benefit.icon}
                      </div>
                      <span className="text-white/90">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-sm text-white/70">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">4.8★</div>
                    <div className="text-sm text-white/70">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">24h</div>
                    <div className="text-sm text-white/70">Response Time</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Subscription Form */}
              <div className="lg:w-1/2 w-full max-w-md">
                {/* Success State */}
                {isSubscribed ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-in fade-in duration-500">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                      <FaCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Welcome Aboard! 🎉
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for subscribing! Check your email for a welcome gift 
                      and your exclusive 15% discount code.
                    </p>
                    <button
                      onClick={() => setIsSubscribed(false)}
                      className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors"
                    >
                      Subscribe Another Email
                    </button>
                  </div>
                ) : (
                  /* Subscription Form */
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Get Your 15% Off
                    </h3>
                    <p className="text-white/80 mb-6">
                      Enter your email to receive your discount code instantly
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <FaEnvelope className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          placeholder="your.email@example.com"
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300"
                          disabled={isSubmitting}
                        />
                      </div>

                      {error && (
                        <div className="text-red-200 text-sm bg-red-500/20 p-3 rounded-lg">
                          ⚠️ {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="w-5 h-5" />
                            Get My Discount Code
                          </>
                        )}
                      </button>
                    </form>

                    {/* Privacy Note */}
                    <div className="mt-6 p-4 bg-white/10 rounded-xl">
                      <div className="flex items-start gap-3">
                        <FaShieldAlt className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />
                        <p className="text-white/70 text-sm">
                          We respect your privacy. Your email is safe with us and 
                          we'll never share it with third parties. You can unsubscribe 
                          at any time with one click.
                        </p>
                      </div>
                    </div>

                    {/* Additional CTA */}
                    <div className="mt-6 text-center">
                      <p className="text-white/70 text-sm">
                        Already subscribed?{" "}
                        <button className="text-white font-medium hover:underline">
                          Check your benefits →
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Simple Version (for footer or sidebar) */}
      {/*
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 max-w-md mx-auto p-4 bg-gray-50 rounded-full">
          <FaEnvelope className="w-5 h-5 text-gray-500" />
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent outline-none"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm">
            Subscribe
          </button>
        </div>
      </div>
      */}
    </div>
  );
};

export default NewsletterCTA;