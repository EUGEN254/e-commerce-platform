import React from "react";
import {
  FaCheckCircle,
  FaUsers,
  FaTrophy,
  FaHeart,
  FaShoppingBag,
  FaShieldAlt,
  FaLeaf,
  FaGlobe,
  FaAward,
  FaHandshake,
  FaRocket,
  FaStar,
} from "react-icons/fa";

const About = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "10+ years in e-commerce",
    },
    {
      name: "Sarah Miller",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w-400&h=400&fit=crop",
      bio: "Supply chain expert",
    },
    {
      name: "Michael Chen",
      role: "Tech Lead",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      bio: "Full-stack developer",
    },
    {
      name: "Emma Davis",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
      bio: "Digital marketing specialist",
    },
  ];

  const values = [
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority",
      color: "text-red-500 bg-red-50",
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Trust & Security",
      description: "Secure transactions and data protection",
      color: "text-blue-500 bg-blue-50",
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: "Sustainability",
      description: "Eco-friendly packaging and practices",
      color: "text-green-500 bg-green-50",
    },
    {
      icon: <FaGlobe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Serving customers worldwide",
      color: "text-purple-500 bg-purple-50",
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Rigorous quality checks on all products",
      color: "text-amber-500 bg-amber-50",
    },
    {
      icon: <FaHandshake className="w-8 h-8" />,
      title: "Partnership",
      description: "Building strong brand relationships",
      color: "text-indigo-500 bg-indigo-50",
    },
  ];

  const milestones = [
    { year: "2018", event: "Company Founded", description: "Started in a small garage" },
    { year: "2019", event: "First 1000 Customers", description: "Reached major milestone" },
    { year: "2020", event: "Mobile App Launch", description: "Expanded to mobile platform" },
    { year: "2021", event: "International Shipping", description: "Started global operations" },
    { year: "2022", event: "1M+ Products Sold", description: "Major sales achievement" },
    { year: "2023", event: "Award Winner", description: "Best E-commerce Platform 2023" },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: <FaUsers /> },
    { number: "10K+", label: "Products Available", icon: <FaShoppingBag /> },
    { number: "100+", label: "Brand Partners", icon: <FaHandshake /> },
    { number: "24/7", label: "Support Available", icon: <FaShieldAlt /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-800 to-purple-600 text-white rounded-2xl">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-5 lg:px-20 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Our Story
              </h1>
              <p className="text-m text-indigo-100 max-w-3xl mx-auto">
                From a small idea to a leading e-commerce platform, we're dedicated to 
                making shopping simple, enjoyable, and accessible for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 lg:px-20 py-16">
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Side - Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                  alt="Our team working together"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className=" bg-indigo-100 rounded-full">
                    <FaTrophy className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">5 Years</div>
                    <div className="text-sm text-gray-600">of Excellence</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div >
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-12 h-1 bg-indigo-600 rounded-full"></span>
                <span className="text-indigo-600 font-semibold">ABOUT US</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Redefining Online Shopping
              </h2>
              
              <div className="space-y-4 text-gray-600 mb-8">
                <p>
                  Founded in 2018, ShopHub began with a simple mission: to create 
                  a seamless shopping experience that connects people with products 
                  they love. What started as a small startup has grown into a 
                  trusted platform serving customers worldwide.
                </p>
                
                <p>
                  We believe shopping should be more than just a transaction. 
                  It's about discovery, inspiration, and finding exactly what 
                  you're looking for. That's why we've curated a diverse selection 
                  of products from both established brands and emerging creators.
                </p>
                
                <p>
                  Our commitment goes beyond just selling products. We're building 
                  a community of passionate shoppers and dedicated partners who 
                  share our vision for a better shopping experience.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Verified product quality</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Fast & reliable shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">24/7 customer support</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Secure payment options</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={`inline-flex p-3 rounded-full mb-4 ${
                  index === 0 ? "bg-indigo-50 text-indigo-600" :
                  index === 1 ? "bg-green-50 text-green-600" :
                  index === 2 ? "bg-purple-50 text-purple-600" :
                  "bg-amber-50 text-amber-600"
                }`}>
                  <div className="w-6 h-6 p-1">{stat.icon}</div>
                </div>
                <div className="text-1xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
                Our Values
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                These principles guide everything we do, from product selection 
                to customer service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-3 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex p-2 rounded-xl mb-4 ${value.color}`}>
                    {value.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-20 ">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Our Journey
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Milestones that shaped our growth and success over the years.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-400 to-purple-400 hidden md:block"></div>

              <div className="space-y-2">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Content */}
                    <div className={`w-full md:w-1/2 ${
                      index % 2 === 0 ? "md:pl-19" : "md:pr-12"
                    }`}>
                      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                        <div className="text-indigo-600 font-bold text-sm mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">
                          {milestone.event}
                        </h3>
                        <p className="text-gray-600 text-xs">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="hidden md:block w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-lg z-10"></div>

                    {/* Year on opposite side for mobile */}
                    <div className="md:hidden text-center my-2">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-lg">
                        {milestone.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Meet Our Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind ShopHub's success.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {member.name}
                    </h3>
                    <div className="text-indigo-600 font-medium mb-2">
                      {member.role}
                    </div>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                    
                    <div className="mt-4 flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className="w-4 h-4 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-5 md:p-8 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <FaRocket className="w-10 h-10 mx-auto mb-6 text-white/80" />
              <h2 className="text-2xl md:text-2xl font-bold mb-4">
                Join Our Journey
              </h2>
              <p className="text-sm text-indigo-100 mb-8">
                Be part of our growing community of shoppers and creators.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-5 py-2 bg-white text-indigo-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Shop Now
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                  Become a Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;