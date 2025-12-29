// src/utils/sidebarLinks.js - Add categories for better organization
import { 
  FaHome, 
  FaUsers, 
  FaBox, 
  FaTags, 
  FaClipboardList,
  FaCreditCard,
  FaFire,
  FaChartBar,
  FaChartLine,
  FaCog,
  FaPlus,
  FaEye,
  FaUserShield,
  FaWarehouse,
  FaCheckCircle,
  FaClock,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaUserFriends,
  FaTruck,
  FaBell,
  FaShoppingCart,
  FaFileAlt,
  FaDatabase,
  FaShieldAlt
} from 'react-icons/fa';

export const sidebarLinks = [
  // DASHBOARD
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: FaHome,
    path: '/dashboard',
    color: 'text-blue-400',
    category: 'main'
  },
  
  // MANAGEMENT
  {
    id: 'users',
    title: 'Users',
    icon: FaUsers,
    path: '/users',
    color: 'text-green-400',
    category: 'management',
    submenu: [
      { 
        title: 'All Users', 
        path: '/users',
        icon: FaEye
      },
      { 
        title: 'Create User', 
        path: '/users/create',
        icon: FaPlus
      },
      { 
        title: 'User Roles', 
        path: '/users/roles',
        icon: FaUserShield
      },
    ]
  },
  {
    id: 'products',
    title: 'Products',
    icon: FaBox,
    path: '/products',
    color: 'text-purple-400',
    category: 'management',
    submenu: [
      { 
        title: 'All Products', 
        path: '/products',
        icon: FaEye
      },
      { 
        title: 'Add Product', 
        path: '/products/create',
        icon: FaPlus
      },
      { 
        title: 'Inventory', 
        path: '/products/inventory',
        icon: FaWarehouse
      },
    ]
  },
  {
    id: 'categories',
    title: 'Categories',
    icon: FaTags,
    path: '/categories',
    color: 'text-yellow-400',
    category: 'management',
    submenu: [
      { 
        title: 'All Categories', 
        path: '/categories',
        icon: FaEye
      },
      { 
        title: 'Add Category', 
        path: '/categories/create',
        icon: FaPlus
      },
      { 
        title: 'Manage Featured', 
        path: '/categories',
        icon: FaFire
      },
    ]
  },
  {
    id: 'orders',
    title: 'Orders',
    icon: FaClipboardList,
    path: '/orders',
    color: 'text-pink-400',
    category: 'management',
    submenu: [
      { 
        title: 'All Orders', 
        path: '/orders',
        icon: FaEye
      },
      { 
        title: 'Pending Orders', 
        path: '/orders/pending',
        icon: FaClock
      },
      { 
        title: 'Completed Orders', 
        path: '/orders/completed',
        icon: FaCheckCircle
      },
    ]
  },
  
  // FINANCE
  {
    id: 'transactions',
    title: 'Transactions',
    icon: FaCreditCard,
    path: '/transactions',
    color: 'text-indigo-400',
    category: 'finance'
  },
  
  // MARKETING
  {
    id: 'limited-offers',
    title: 'Limited Offers',
    icon: FaFire,
    path: '/limited-offers',
    color: 'text-red-400',
    category: 'marketing'
  },
  
  // ANALYTICS
  {
    id: 'analytics',
    title: 'Analytics',
    icon: FaChartBar,
    path: '/analytics',
    color: 'text-teal-400',
    category: 'analytics',
    submenu: [
      { 
        title: 'Sales Analytics', 
        path: '/analytics/sales',
        icon: FaChartLine
      },
      { 
        title: 'User Analytics', 
        path: '/analytics/users',
        icon: FaChartLine
      },
      { 
        title: 'Product Analytics', 
        path: '/analytics/products',
        icon: FaBoxOpen
      },
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: FaChartLine,
    path: '/reports',
    color: 'text-orange-400',
    category: 'analytics',
    submenu: [
      { 
        title: 'Sales Reports', 
        path: '/reports/sales',
        icon: FaFileInvoiceDollar
      },
      { 
        title: 'Inventory Reports', 
        path: '/reports/inventory',
        icon: FaWarehouse
      },
      { 
        title: 'User Reports', 
        path: '/reports/users',
        icon: FaUserFriends
      },
    ]
  },
  
  // SETTINGS
  {
    id: 'settings',
    title: 'Settings',
    icon: FaCog,
    path: '/settings',
    color: 'text-gray-400',
    category: 'settings',
    submenu: [
      { 
        title: 'General', 
        path: '/settings/general',
        icon: FaCog
      },
      { 
        title: 'Payment', 
        path: '/settings/payment',
        icon: FaCreditCard
      },
      { 
        title: 'Shipping', 
        path: '/settings/shipping',
        icon: FaTruck
      },
      { 
        title: 'Notifications', 
        path: '/settings/notifications',
        icon: FaBell
      },
    ]
  },
];

// Optional: Group by category
export const getSidebarLinksByCategory = () => {
  const categories = {
    main: [],
    management: [],
    finance: [],
    marketing: [],
    analytics: [],
    settings: []
  };
  
  sidebarLinks.forEach(item => {
    if (categories[item.category]) {
      categories[item.category].push(item);
    }
  });
  
  return categories;
};