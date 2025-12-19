// Remove these icon imports from assets file - they belong in your component
// import { FaTshirt, FaLaptop, FaCouch, FaShoePrints, FaMobileAlt } from 'react-icons/fa';

import shoe1 from "./shoe1.png";
import premiumShoeGeneral from "./premiumrunningshoe.jpg";
import wireless from "./wireless.jpg";
import teashirt from "./teashirt.jpg";
import laptopbag from "./laptop.jpg";
import cofeemaker from "./cofeemaker.jpg";

// Import all fashion images
import premiumShoe from "./premiumShoe.jpg";
import casualSneakers from "./casualSneakers.jpg";
import formalShoes from "./formalShoes.jpg";
import sportsShoes from "./sportsShoes.jpg";
import boots from "./boots.jpg";
import heels from "./heels.jpg";

import designerTshirt from "./designerTshirt.jpg";
import casualShirt from "./casualShirt.jpg";
import formalShirt from "./formalShirt.jpg";
import hoodie from "./hoodie.jpg";
import jeans from "./jeans.jpg";
import dress from "./dress.jpg";
import jacket from "./jacket.jpg";
import sweater from "./sweater.jpg";

import leatherBag from "./leatherBag.jpg";
import backpack from "./backpack.jpg";
import wallet from "./wallet.jpg";
import belt from "./belt.jpg";
import watch from "./watch.jpg";
import sunglasses from "./sunglasses.jpg";
import jewelry from "./jewelry.jpg";

const assets = {
  shoe1,
  premiumShoe: premiumShoeGeneral,
  wireless,
  teashirt,
  laptopbag,
  cofeemaker,
};

export default assets;

// Featured products data
export const featuredProducts = [
  {
    id: 1,
    name: "Premium Running Shoes",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.5,
    reviewCount: 128,
    image: assets.premiumShoe,
    tag: "BEST SELLER",
    tagColor: "bg-red-500",
    discount: 25,
  },
  {
    id: 2,
    name: "Wireless Bluetooth Headphones",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviewCount: 256,
    image: assets.wireless,
    tag: "TRENDING",
    tagColor: "bg-blue-500",
    discount: 19,
  },
  {
    id: 3,
    name: "Designer T-Shirt Collection",
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.3,
    reviewCount: 89,
    image: assets.teashirt,
    tag: "SALE",
    tagColor: "bg-green-500",
    discount: 40,
  },
  {
    id: 4,
    name: "Laptop Backpack",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.4,
    reviewCount: 167,
    image: assets.laptopbag,
    tag: "POPULAR",
    tagColor: "bg-orange-500",
    discount: 29,
  },
  {
    id: 5,
    name: "Coffee Maker Deluxe",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.6,
    reviewCount: 213,
    image: assets.cofeemaker,
    tag: "HOT",
    tagColor: "bg-pink-500",
    discount: 31,
  },
];

// Export image assets
export const fashionAssets = {
  // Shoes
  shoes: {
    premiumShoe,
    casualSneakers,
    formalShoes,
    sportsShoes,
    boots,
    heels,
  },

  // Clothing
  clothing: {
    designerTshirt,
    casualShirt,
    formalShirt,
    hoodie,
    jeans,
    dress,
    jacket,
    sweater,
  },

  // Accessories
  accessories: {
    leatherBag,
    backpack,
    wallet,
    belt,
    watch,
    sunglasses,
    jewelry,
  },
};

// SINGLE fashionCategories array containing all categories
export const fashionCategories = [
  {
    id: "fashion",
    name: "Fashion",
    icon: "FaTshirt",
    path: "/shop/fashion",
    type: "main",
    isMainCategory: true,
    subcategories: [
      "Men's Fashion",
      "Women's Fashion",
      "Kids Fashion",
      "Unisex",
      "Premium Brands",
      "Seasonal Collections",
    ],
    description: "Complete fashion wardrobe for everyone",
    totalProducts: 500,
  },

  {
    id: "electronics",
    name: "Electronics",
    icon: "FaLaptop",
    path: "/shop/electronics",
    type: "main",
    isMainCategory: true,
    subcategories: [
      "Laptops & Computers",
      "Smartphones",
      "Audio & Headphones",
      "Gaming",
      "Wearables",
      "Home Electronics",
    ],
    description: "Latest tech gadgets and devices",
    totalProducts: 320,
  },

  {
    id: "home",
    name: "Home",
    icon: "FaCouch",
    path: "/shop/home",
    type: "main",
    isMainCategory: true,
    subcategories: [
      "Furniture",
      "Home Decor",
      "Kitchen & Dining",
      "Bed & Bath",
      "Lighting",
      "Storage & Organization",
    ],
    description: "Everything for your home comfort",
    totalProducts: 280,
  },

  {
    id: "shoes",
    name: "Shoes",
    icon: "FaShoePrints",
    path: "/shop/shoes",
    type: "fashion",
    isMainCategory: true,
    subcategories: [
      "Sneakers",
      "Formal",
      "Sports",
      "Boots",
      "Heels",
      "Sandals",
    ],
    description: "Step in style with our premium footwear collection",
    totalProducts: 156,
  },

  {
    id: "mobile",
    name: "Mobile",
    icon: "FaMobileAlt",
    path: "/shop/mobile",
    type: "main",
    isMainCategory: true,
    subcategories: [
      "Smartphones",
      "Tablets",
      "Mobile Accessories",
      "Smartwatches",
      "Earbuds",
      "Power Banks",
    ],
    description: "Mobile devices and accessories",
    totalProducts: 190,
  },

  {
    id: "clothing",
    name: "Clothing",
    icon: "FaUserTie",
    path: "/shop/clothing",
    type: "fashion",
    isMainCategory: true,
    subcategories: [
      "T-Shirts",
      "Shirts",
      "Jeans",
      "Dresses",
      "Jackets",
      "Activewear",
    ],
    description: "Wear your personality with our trendy clothing line",
    totalProducts: 289,
  },

  {
    id: "accessories",
    name: "Accessories",
    icon: "FaShoppingBasket",
    path: "/shop/accessories",
    type: "fashion",
    isMainCategory: true,
    subcategories: [
      "Bags",
      "Watches",
      "Jewelry",
      "Sunglasses",
      "Belts",
      "Wallets",
    ],
    description: "Complete your look with premium accessories",
    totalProducts: 124,
  },

  {
    id: "beauty",
    name: "Beauty",
    icon: "FaSprayCan",
    path: "/shop/beauty",
    type: "main",
    isMainCategory: true,
    subcategories: [
      "Skincare",
      "Makeup",
      "Fragrances",
      "Hair Care",
      "Bath & Body",
      "Men's Grooming",
    ],
    description: "Beauty products for everyone",
    totalProducts: 175,
  },

  {
    id: "sports",
    name: "Sports",
    icon: "FaRunning",
    path: "/shop/sports",
    type: "main",
    isMainCategory: true,
    subcategories: [
      "Fitness Equipment",
      "Sportswear",
      "Outdoor Gear",
      "Team Sports",
      "Yoga & Pilates",
      "Cycling",
    ],
    description: "Gear up for your active lifestyle",
    totalProducts: 210,
  },

  {
    id: "books",
    name: "Books",
    icon: "FaBook",
    path: "/shop/books",
    type: "main",
    isMainCategory: true,
    subcategories: [
      "Fiction",
      "Non-Fiction",
      "Academic",
      "Children's Books",
      "Best Sellers",
      "E-Books",
    ],
    description: "Expand your mind with great reads",
    totalProducts: 340,
  },
];

// Helper function to get fashion-only categories
export const getFashionSubcategories = () => {
  return fashionCategories.filter((cat) => cat.type === "fashion");
};

// Helper function to get main categories
export const getMainCategories = () => {
  return fashionCategories.filter((cat) => cat.isMainCategory);
};

// Featured fashion products
export const featuredFashionProducts = [
  {
    id: 1,
    name: "Premium Running Shoes",
    category: "shoes",
    subcategory: "Sneakers",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.5,
    reviewCount: 128,
    image: fashionAssets.shoes.premiumShoe,
    tag: "BEST SELLER",
    tagColor: "bg-red-500",
    discount: 25,
    description:
      "High-performance running shoes with advanced cushioning technology",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black", "White", "Blue", "Red"],
    brand: "Nike",
    inStock: true,
    fastDelivery: true,
  },
  {
    id: 2,
    name: "Designer Casual T-Shirt",
    category: "clothing",
    subcategory: "T-Shirts",
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.3,
    reviewCount: 89,
    image: fashionAssets.clothing.designerTshirt,
    tag: "TRENDING",
    tagColor: "bg-blue-500",
    discount: 40,
    description: "Premium cotton t-shirt with modern design and perfect fit",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Grey", "Navy"],
    brand: "Adidas",
    inStock: true,
    fastDelivery: true,
  },
  {
    id: 3,
    name: "Leather Crossbody Bag",
    category: "accessories",
    subcategory: "Bags",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviewCount: 203,
    image: fashionAssets.accessories.leatherBag,
    tag: "PREMIUM",
    tagColor: "bg-amber-600",
    discount: 20,
    description: "Genuine leather bag with multiple compartments",
    sizes: ["One Size"],
    colors: ["Brown", "Black", "Tan"],
    brand: "Fossil",
    inStock: true,
    fastDelivery: false,
  },
  {
    id: 4,
    name: "Slim Fit Denim Jeans",
    category: "clothing",
    subcategory: "Jeans",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.4,
    reviewCount: 167,
    image: fashionAssets.clothing.jeans,
    tag: "POPULAR",
    tagColor: "bg-orange-500",
    discount: 25,
    description: "Comfortable slim-fit jeans with stretch technology",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Blue", "Black", "Grey"],
    brand: "Levi's",
    inStock: true,
    fastDelivery: true,
  },
  {
    id: 5,
    name: "Sports Performance Jacket",
    category: "clothing",
    subcategory: "Jackets",
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.6,
    reviewCount: 142,
    image: fashionAssets.clothing.jacket,
    tag: "NEW",
    tagColor: "bg-green-500",
    discount: 22,
    description: "Water-resistant jacket for outdoor activities",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Red"],
    brand: "Under Armour",
    inStock: true,
    fastDelivery: true,
  },
  {
    id: 6,
    name: "Classic Leather Watch",
    category: "accessories",
    subcategory: "Watches",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewCount: 315,
    image: fashionAssets.accessories.watch,
    tag: "LUXURY",
    tagColor: "bg-purple-600",
    discount: 25,
    description: "Elegant leather strap watch with mineral glass",
    sizes: ["Regular"],
    colors: ["Brown", "Black"],
    brand: "Seiko",
    inStock: true,
    fastDelivery: true,
  },
  {
    id: 7,
    name: "Women's Summer Dress",
    category: "clothing",
    subcategory: "Dresses",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.5,
    reviewCount: 98,
    image: fashionAssets.clothing.dress,
    tag: "SALE",
    tagColor: "bg-pink-500",
    discount: 29,
    description: "Lightweight floral dress perfect for summer",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral", "Blue", "Yellow"],
    brand: "Zara",
    inStock: true,
    fastDelivery: false,
  },
  {
    id: 8,
    name: "Comfort Hoodie",
    category: "clothing",
    subcategory: "Hoodies",
    price: 44.99,
    originalPrice: 59.99,
    rating: 4.3,
    reviewCount: 187,
    image: fashionAssets.clothing.hoodie,
    tag: "COMFORT",
    tagColor: "bg-indigo-500",
    discount: 25,
    description: "Soft cotton hoodie with kangaroo pocket",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey", "Black", "Navy", "Green"],
    brand: "Champion",
    inStock: true,
    fastDelivery: true,
  },
];

// Additional fashion products by category
export const fashionProductsByCategory = {
  shoes: [
    {
      id: 101,
      name: "Casual Sneakers",
      subcategory: "Sneakers",
      price: 64.99,
      originalPrice: 84.99,
      rating: 4.4,
      reviewCount: 156,
      image: fashionAssets.shoes.casualSneakers,
      tag: "CASUAL",
      discount: 24,
      brand: "Converse",
    },
    {
      id: 102,
      name: "Formal Leather Shoes",
      subcategory: "Formal",
      price: 99.99,
      originalPrice: 129.99,
      rating: 4.6,
      reviewCount: 89,
      image: fashionAssets.shoes.formalShoes,
      tag: "FORMAL",
      discount: 23,
      brand: "Clarks",
    },
  ],
  clothing: [
    {
      id: 201,
      name: "Formal Business Shirt",
      subcategory: "Shirts",
      price: 39.99,
      originalPrice: 54.99,
      rating: 4.5,
      reviewCount: 123,
      image: fashionAssets.clothing.formalShirt,
      tag: "BUSINESS",
      discount: 27,
      brand: "Van Heusen",
    },
  ],
  accessories: [
    {
      id: 301,
      name: "Designer Sunglasses",
      subcategory: "Sunglasses",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.7,
      reviewCount: 214,
      image: fashionAssets.accessories.sunglasses,
      tag: "STYLE",
      discount: 25,
      brand: "Ray-Ban",
    },
  ],
};
