import React from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube 
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Footer has no debug logs

  return (
    <footer className="bg-foreground pl-10 pr-10 rounded-t-2xl text-background mt-auto">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">E</span>
              </div>
              <span className="font-display font-bold text-2xl">E-Shop</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Your one-stop destination for everything you love. Quality products, great prices, and exceptional service.
            </p>
            <div className="space-y-3">
              <p className="font-medium text-sm">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button variant="secondary" size="sm" className="whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {['About Us', 'Shop', 'Contact', 'FAQs', 'Blog'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-background/70 hover:text-background transition-colors text-sm block py-1"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg">Customer Service</h3>
            <ul className="space-y-3">
              {['Track Order', 'Shipping Policy', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                    className="text-background/70 hover:text-background transition-colors text-sm block py-1"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                <span>123 E-Commerce Street, Digital City, DC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-5 w-5 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-5 w-5 shrink-0" />
                <span>support@eshop.com</span>
              </li>
            </ul>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <Button 
                  key={i} 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 hover:bg-background/10 text-background/70 hover:text-background"
                  onClick={scrollToTop}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/70">
              © {new Date().getFullYear()} E-Shop. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                <span key={method} className="text-xs text-background/70">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;