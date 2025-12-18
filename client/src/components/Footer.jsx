import React from "react";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaPinterest,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmazonPay,
  FaApplePay,
  FaGooglePay,
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaArrowUp
} from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = {
    Shop: [
      { name: "New Arrivals", url: "/shop/new" },
      { name: "Best Sellers", url: "/shop/bestsellers" },
      { name: "Sale", url: "/shop/sale" },
      { name: "Featured", url: "/shop/featured" },
    ],
    Categories: [
      { name: "Fashion", url: "/shop/fashion" },
      { name: "Electronics", url: "/shop/electronics" },
      { name: "Home & Living", url: "/shop/home" },
      { name: "Shoes", url: "/shop/shoes" },
      { name: "Mobile", url: "/shop/mobile" },
      { name: "Beauty", url: "/shop/beauty" },
    ],
    Support: [
      { name: "Help Center", url: "/help" },
      { name: "Contact Us", url: "/contact" },
      { name: "Shipping Info", url: "/shipping" },
      { name: "Returns & Exchanges", url: "/returns" },
      { name: "Size Guide", url: "/size-guide" },
      { name: "FAQ", url: "/faq" },
    ],
    Company: [
      { name: "About Us", url: "/about" },
      { name: "Careers", url: "/careers" },
      { name: "Blog", url: "/blog" },
      { name: "Press", url: "/press" },
      { name: "Affiliate Program", url: "/affiliate" },
      { name: "Store Locator", url: "/stores" },
    ],
  };

  const socialMedia = [
    { icon: <FaFacebook />, name: "Facebook", url: "https://facebook.com" },
    { icon: <FaInstagram />, name: "Instagram", url: "https://instagram.com" },
    { icon: <FaTwitter />, name: "Twitter", url: "https://twitter.com" },
    { icon: <FaPinterest />, name: "Pinterest", url: "https://pinterest.com" },
    { icon: <FaYoutube />, name: "YouTube", url: "https://youtube.com" },
    { icon: <FaLinkedin />, name: "LinkedIn", url: "https://linkedin.com" },
  ];

  const paymentMethods = [
    { icon: <FaCcVisa />, name: "Visa" },
    { icon: <FaCcMastercard />, name: "Mastercard" },
    { icon: <FaCcPaypal />, name: "PayPal" },
    { icon: <FaCcAmazonPay />, name: "Amazon Pay" },
    { icon: <FaApplePay />, name: "Apple Pay" },
    { icon: <FaGooglePay />, name: "Google Pay" },
  ];

  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Secure Payment",
      desc: "100% secure transactions"
    },
    {
      icon: <FaTruck />,
      title: "Free Shipping",
      desc: "On orders over $50"
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      desc: "Dedicated customer service"
    },
    {
      icon: <FaArrowUp />,
      title: "Easy Returns",
      desc: "30-day return policy"
    }
  ];

  return (
    <footer className="mt-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
  

      {/* Main Footer */}
      <div className="px-5 lg:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                <span className="text-white">Shop</span>
                <span className="text-indigo-400">Hub</span>
              </h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Your one-stop destination for all shopping needs. 
                Discover amazing products, exclusive deals, and seamless shopping experience.
              </p>
            </div>


            {/* Social Media */}
            <div>
              <h3 className="font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    aria-label={social.name}
                  >
                    <div className="w-5 h-5">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links Columns */}
          {Object.entries(quickLinks).map(([category, links], index) => (
            <div key={index}>
              <h3 className="font-bold text-m mb-4 text-white">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-white transition-colors duration-300 hover:pl-2 block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-indigo-500/20">
              <FaMapMarkerAlt className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Our Location</h4>
              <p className="text-gray-400">
                123 Shopping Street<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-indigo-500/20">
              <FaPhone className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Contact Us</h4>
              <p className="text-gray-400">
                <a href="tel:+11234567890" className="hover:text-white">
                  +1 (123) 456-7890
                </a>
                <br />
                <a href="mailto:hello@shophub.com" className="hover:text-white">
                  hello@shophub.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-indigo-500/20">
              <FaEnvelope className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Business Hours</h4>
              <p className="text-gray-400">
                Monday - Friday: 9AM - 8PM EST<br />
                Saturday - Sunday: 10AM - 6PM EST<br />
                24/7 Online Support
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h4 className="font-semibold mb-4 text-center">We Accept</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                title={method.name}
              >
                <div className="text-2xl text-gray-300">
                  {method.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-5 lg:px-20 py-6 bg-gray-900">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © {currentYear} ShopHub. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </a>
            <a href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
              Sitemap
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            ShopHub is a registered trademark. All product names, logos, and brands are property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;