import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHeadset,
  FaWhatsapp,
  FaUser,
  FaComment,
  FaBuilding,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Call Us",
      details: ["+1 (234) 567-8900", "+1 (234) 567-8901"],
      color: "bg-blue-50 text-blue-600",
      action: "Call Now",
      link: "tel:+12345678900",
    },
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      details: ["support@shophub.com", "sales@shophub.com"],
      color: "bg-green-50 text-green-600",
      action: "Send Email",
      link: "mailto:support@shophub.com",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Visit Us",
      details: ["123 Shopping Street", "New York, NY 10001", "United States"],
      color: "bg-purple-50 text-purple-600",
      action: "Get Directions",
      link: "https://maps.google.com",
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9AM - 8PM EST",
        "Saturday: 10AM - 6PM EST",
        "Sunday: 11AM - 5PM EST",
        "24/7 Online Support",
      ],
      color: "bg-orange-50 text-orange-600",
      action: "View Hours",
      link: "#hours",
    },
  ];

  const departments = [
    {
      id: "general",
      name: "General Inquiry",
      description: "For general questions about our products and services",
      icon: <FaHeadset />,
    },
    {
      id: "sales",
      name: "Sales",
      description: "Get quotes, pricing, and product information",
      icon: <FaComment />,
    },
    {
      id: "support",
      name: "Customer Support",
      description: "Technical support and product assistance",
      icon: <FaWhatsapp />,
    },
    {
      id: "business",
      name: "Business Partnership",
      description: "For wholesale and partnership inquiries",
      icon: <FaBuilding />,
    },
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping is 1-2 business days.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unused items in original packaging.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 50 countries worldwide.",
    },
    {
      question: "How can I track my order?",
      answer: "Tracking information is sent via email once your order ships.",
    },
  ];

  const socialMedia = [
    { icon: <FaFacebook />, name: "Facebook", url: "https://facebook.com" },
    { icon: <FaInstagram />, name: "Instagram", url: "https://instagram.com" },
    { icon: <FaTwitter />, name: "Twitter", url: "https://twitter.com" },
    { icon: <FaLinkedin />, name: "LinkedIn", url: "https://linkedin.com" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-600 text-white py-10 px-5 lg:px-15 rounded-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-3xl font-bold mb-4">
              Get in Touch With Us
            </h1>
            <p className="text-m text-indigo-100 max-w-3xl mx-auto">
              We're here to help! Reach out to our team for any questions,
              support, or partnership opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`inline-flex p-2 rounded-full mb-4 ${info.color} items-center justify-center`}
                >
                  <div className="w-6 h-6 p-1">{info.icon}</div>
                </div>
                <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-indigo-100 text-sm mb-1">
                    {detail}
                  </p>
                ))}
                <div className="mt-4 text-sm font-medium flex items-center gap-2">
                  {info.action}
                  <span className="text-lg">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-5 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and our team will get back to you
                  within 24 hours.
                </p>
              </div>

              {/* Department Tabs */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => setActiveTab(dept.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                        activeTab === dept.id
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {dept.icon}
                      <span className="font-medium">{dept.name}</span>
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-indigo-800">
                    {departments.find((d) => d.id === activeTab)?.description}
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <FaCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-800">Message Sent!</h3>
                    <p className="text-green-700 text-sm">
                      Thank you for contacting us. We'll get back to you
                      shortly.
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline w-4 h-4 mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaComment className="inline w-4 h-4 mr-2" />
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  By submitting this form, you agree to our{" "}
                  <a
                    href="/privacy"
                    className="text-indigo-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* FAQ Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="font-bold text-gray-800 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <a
                    href="/faq"
                    className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center gap-2"
                  >
                    View all FAQs
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-white/20 rounded-full">
                    <FaWhatsapp className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Live Chat Support
                    </h3>
                    <p className="text-green-100">
                      Chat with our support team in real-time
                    </p>
                  </div>
                </div>
                <button className="w-full py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors">
                  Start Live Chat
                </button>
                <p className="text-center text-green-100 text-sm mt-3">
                  Average response time:{" "}
                  <span className="font-bold">2 minutes</span>
                </p>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Connect With Us
                </h2>
                <p className="text-gray-600 mb-6">
                  Follow us on social media for updates, promotions, and more!
                </p>
                <div className="flex gap-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 flex-1 text-center"
                    >
                      <div className="w-8 h-8 mx-auto mb-2">{social.icon}</div>
                      <span className="text-sm font-medium">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Visit Our Store
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <FaMapMarkerAlt className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-800">Our Location</h3>
                      <p className="text-gray-600">
                        123 Shopping Street
                        <br />
                        New York, NY 10001
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FaClock className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-800">Store Hours</h3>
                      <p className="text-gray-600">
                        Monday - Saturday: 10AM - 9PM
                        <br />
                        Sunday: 11AM - 7PM
                        <br />
                        <span className="text-green-600 font-medium">
                          Open Now
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <FaMapMarkerAlt className="w-5 h-5" />
                  Get Directions
                </button>
              </div>

              {/* Map Placeholder */}
              <div className="h-64 lg:h-auto bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkerAlt className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Interactive Map</p>
                    <p className="text-gray-500 text-sm">
                      (Would show Google Maps integration)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-700 text-white py-10 px-5 lg:px-10 rounded-2xl">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Call Now: +1 (234) 567-8900
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
