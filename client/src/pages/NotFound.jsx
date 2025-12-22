import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, ArrowLeft, AlertCircle, ShoppingBag, Tag, Clock, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";


const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the path that wasn't found
  const notFoundPath = location.pathname;
  
  // Suggestions based on the path
  const getSuggestions = () => {
    const path = notFoundPath.toLowerCase();
    
    if (path.includes('/product') || path.includes('/item')) {
      return {
        title: "Product Not Found",
        message: "The product you're looking for might have been removed or is temporarily unavailable.",
        action: "Browse Products",
        actionPath: "/shop"
      };
    }
    
    if (path.includes('/offer') || path.includes('/deal')) {
      return {
        title: "Offer Not Found",
        message: "This limited-time offer might have expired or is no longer available.",
        action: "View Active Offers",
        actionPath: "/offers"
      };
    }
    
    if (path.includes('/category')) {
      return {
        title: "Category Not Found",
        message: "This category doesn't exist or has been renamed.",
        action: "Browse Categories",
        actionPath: "/categories"
      };
    }
    
    if (path.includes('/user') || path.includes('/profile')) {
      return {
        title: "Profile Not Found",
        message: "The user profile you're looking for doesn't exist.",
        action: "Go to My Profile",
        actionPath: "/profile"
      };
    }
    
    return {
      title: "Page Not Found",
      message: "The page you're looking for doesn't exist or has been moved.",
      action: "Go to Homepage",
      actionPath: "/"
    };
  };
  
  const suggestions = getSuggestions();
  
  // Popular pages to suggest
  const popularPages = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Shop", path: "/shop", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Offers", path: "/offers", icon: <Tag className="h-4 w-4" /> },
    { name: "Cart", path: "/cart", icon: <ShoppingBag className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Error Code */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-900 opacity-10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-20 w-20 text-red-600" />
            </div>
          </div>
        </div>
        
        {/* Title & Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {suggestions.title}
        </h1>
        
        <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
          {suggestions.message}
        </p>
        
        {/* Display the path that wasn't found */}
        <div className="bg-gray-100 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <Search className="h-4 w-4" />
            <code className="font-mono text-sm break-all">
              {notFoundPath}
            </code>
          </div>
        </div>
        
        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate(suggestions.actionPath)}
            className="px-6 py-3"
          >
            {suggestions.action}
          </Button>
        </div>
        
        {/* Divider */}
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or explore these pages</span>
          </div>
        </div>
        
        {/* Popular Pages Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {popularPages.map((page) => (
            <button
              key={page.path}
              onClick={() => navigate(page.path)}
              className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  {page.icon}
                </div>
                <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  {page.name}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Search Suggestions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Can't find what you're looking for?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RefreshCw className="h-3 w-3" />
              </div>
              <p className="text-blue-800">
                <strong>Check the URL</strong> - Make sure you typed the address correctly
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="h-3 w-3" />
              </div>
              <p className="text-blue-800">
                <strong>Try again later</strong> - The page might be temporarily unavailable
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Search className="h-3 w-3" />
              </div>
              <p className="text-blue-800">
                <strong>Use the search</strong> - Find what you need using our search feature
              </p>
            </div>
          </div>
        </div>
        
        {/* Report Issue */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">
            Think this is an error? Let us know
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/contact")}
              className="px-4"
            >
              Contact Support
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="px-4"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 h-60 w-60 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default NotFound;