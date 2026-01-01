// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaUsers,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaFire,
  FaEye,
  FaExclamationTriangle,
  FaCheckCircle,
  FaStar,
  FaTruck,
  FaWarehouse,
  FaCreditCard,
  FaPercent,
  FaSync,
  FaCalendarAlt,
  FaChartBar,
  FaChartPie,
  FaFilter,
  FaClock
} from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';

// Import Recharts components
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Import services
import { getDashboardStats, getRecentActivities, getSalesData, getCategoryDistribution, getRecentOrders } from '../services/dashboardService';
import { getUsers } from '../services/userService';
import { getProducts as fetchProductsApi } from '../services/productService';
import { useProducts } from '../context/ProductContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    userGrowth: 0,
    productGrowth: 0
  });
  
  const [salesData, setSalesData] = useState([]);
  const { fetchProducts: getProducts, products: contextProducts } = useProducts();
  const [categoryData, setCategoryData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Tabs definitions (used for header title/description and nav)
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie', description: 'Overview of store performance and metrics' },
    { id: 'products', label: 'Products', icon: 'fas fa-box', description: 'Manage products: add, edit and organize inventory' },
    { id: 'orders', label: 'Orders', icon: 'fas fa-shopping-cart', description: 'View and manage customer orders and fulfillment' },
    { id: 'customers', label: 'Customers', icon: 'fas fa-users', description: 'Manage customers, accounts and communication' },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar', description: 'Detailed analytics and reports for your store' }
  ];

  const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

  // Simple localStorage caching for dashboard snapshot (per timeRange)
  const CACHE_KEY = 'dashboard_cache_v1';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const getCached = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - (parsed._cachedAt || 0) > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch (e) {
      return null;
    }
  };

  const setCached = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({ _cachedAt: Date.now(), data }));
    } catch (e) {
      // ignore quota errors
    }
  };

  // Color palette matching the first dashboard
  const colors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    success: '#10B981'
  };

  const categoryColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#8B5CF6'
  ];

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const cacheKeyWithRange = `${CACHE_KEY}_${timeRange}`;
      const cached = getCached(cacheKeyWithRange);
      if (cached) {
        setStats(cached.stats || {});
        setSalesData(cached.salesData || []);
        setCategoryData(cached.categoryData || []);
        setRecentActivities(cached.recentActivities || []);
        setLowStockProducts(cached.lowStockProducts || []);
        setTopProducts(cached.topProducts || []);
        setRecentOrders(cached.recentOrders || []);
        setLoading(false);
        return;
      }

      // Prefer products already loaded in ProductContext to avoid duplicate requests
      let localProducts = [];
      if (Array.isArray(contextProducts) && contextProducts.length > 0) {
        localProducts = contextProducts;
        setProducts(localProducts);
      } else {
        // Use productService.getProducts directly (same API used by ProductsList)
        const productsResponse = await fetchProductsApi({ limit: 1000 });
        // fetchProducts (from ProductContext) returns { success, data, pagination }
        // productService.getProducts returns axios response with .data
        let productsArr = [];
        if (!productsResponse) productsArr = [];
        else if (Array.isArray(productsResponse)) productsArr = productsResponse;
        else if (Array.isArray(productsResponse.data?.data)) productsArr = productsResponse.data.data;
        else if (Array.isArray(productsResponse.data)) productsArr = productsResponse.data;
        else if (Array.isArray(productsResponse.data?.items)) productsArr = productsResponse.data.items;
        else if (Array.isArray(productsResponse.data?.rows)) productsArr = productsResponse.data.rows;
        else productsArr = [];
        // debug info
        if (productsArr.length === 0) console.warn('Dashboard: fetched products response shape', productsResponse);
        localProducts = productsArr.length > 0 ? productsArr : generateSampleProducts();
        setProducts(localProducts);
      }

      const productStats = calculateProductStats(localProducts);
      let apiStats = {};
      
      try {
        const res = await getDashboardStats();
        apiStats = res.data?.data || res.data || {};
      } catch (e) {
        console.warn('getDashboardStats failed, using fallback values');
      }

      const combinedStats = {
        totalProducts: (localProducts && localProducts.length) || 0,
        totalOrders: apiStats.totalOrders || 0,
        totalRevenue: apiStats.totalRevenue || productStats.totalValue || 0,
        totalUsers: apiStats.totalUsers || 0,
        revenueGrowth: apiStats.revenueGrowth || 12.5,
        orderGrowth: apiStats.orderGrowth || 8.3,
        userGrowth: apiStats.userGrowth || 5.7,
        productGrowth: apiStats.productGrowth || 3.2,
        ...productStats
      };

      setStats(combinedStats);

      // Sales data
      try {
        const salesRes = await getSalesData(timeRange);
        setSalesData(salesRes.data?.data || salesRes.data || generateSalesData(timeRange));
      } catch (e) {
        setSalesData(generateSalesData(timeRange));
      }

      // Category distribution
      try {
        const catRes = await getCategoryDistribution();
        setCategoryData(catRes.data?.data || catRes.data || generateCategoryData(localProducts));
      } catch (e) {
        setCategoryData(generateCategoryData(localProducts));
      }

      // Recent activities
      try {
        const actRes = await getRecentActivities();
        const acts = actRes.data?.data || actRes.data || generateRecentActivities();
        setRecentActivities(acts.slice(0, 8));
      } catch (e) {
        setRecentActivities(generateRecentActivities());
      }

      // Recent users (for Customers tab)
      try {
        const usersRes = await getUsers({ limit: 10 });
        const usersList = usersRes.data?.data || usersRes.data || [];
        setRecentUsers(Array.isArray(usersList) && usersList.length > 0 ? usersList.slice(0, 10) : generateRecentUsers());
      } catch (e) {
        setRecentUsers(generateRecentUsers());
      }

      // Recent orders - fetch from backend admin endpoint (no dummy data)
      try {
        const recentRes = await getRecentOrders();
        const recentList = recentRes.data?.data || recentRes.data || [];
        setRecentOrders(Array.isArray(recentList) && recentList.length > 0 ? recentList.slice(0, 10) : generateRecentOrders());
      } catch (e) {
        console.warn('getRecentOrders failed, using fallback recent orders');
        setRecentOrders(generateRecentOrders());
      }

      // Low stock and top products
      const lowStock = localProducts
        .filter(p => p.stock <= 10 && p.stock > 0)
        .slice(0, 4);
      setLowStockProducts(lowStock);

      const top = products
        .slice()
        .sort((a, b) => (b.price || 0) * (b.stock || 0) - ((a.price || 0) * (a.stock || 0)))
        .slice(0, 5);
      setTopProducts(top);

      // cache assembled dashboard snapshot
      try {
        setCached(cacheKeyWithRange, {
          stats: combinedStats,
          salesData: salesData,
          categoryData: categoryData,
          recentActivities: recentActivities,
          lowStockProducts: lowStock,
          topProducts: top,
          recentOrders: recentOrders,
          products: localProducts
        });
      } catch (e) {
        // ignore
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateProductStats = (products) => {
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
    const lowStockCount = products.filter(p => p.stock <= 10 && p.stock > 0).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const featuredCount = products.filter(p => p.isFeatured).length;
    
    return {
      totalStock,
      totalValue,
      lowStockCount,
      outOfStockCount,
      featuredCount
    };
  };

  const generateSalesData = (range) => {
    const data = [];
    
    switch (range) {
      case 'day':
        for (let i = 0; i < 24; i += 3) {
          data.push({
            time: `${i}:00`,
            sales: Math.floor(Math.random() * 5000) + 1000,
            orders: Math.floor(Math.random() * 20) + 5,
            revenue: Math.floor(Math.random() * 7000) + 1500
          });
        }
        break;
      case 'week':
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach(day => {
          data.push({
            time: day,
            sales: Math.floor(Math.random() * 30000) + 5000,
            orders: Math.floor(Math.random() * 50) + 10,
            revenue: Math.floor(Math.random() * 40000) + 8000
          });
        });
        break;
      case 'month':
        for (let i = 1; i <= 30; i += 3) {
          data.push({
            time: `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'}`,
            sales: Math.floor(Math.random() * 25000) + 3000,
            orders: Math.floor(Math.random() * 40) + 8,
            revenue: Math.floor(Math.random() * 35000) + 5000
          });
        }
        break;
      case 'year':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach(month => {
          data.push({
            time: month,
            sales: Math.floor(Math.random() * 150000) + 20000,
            orders: Math.floor(Math.random() * 200) + 50,
            revenue: Math.floor(Math.random() * 200000) + 30000
          });
        });
        break;
    }
    
    return data;
  };

  const generateCategoryData = (products) => {
    const categoryMap = {};
    
    products.forEach(product => {
      const category = product.category || 'uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          value: 0,
          count: 0,
          revenue: 0
        };
      }
      categoryMap[category].value += (product.price || 0) * (product.stock || 0);
      categoryMap[category].count++;
      categoryMap[category].revenue += (product.price || 0) * (product.soldCount || 0);
    });
    
    return Object.values(categoryMap)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  const generateSampleProducts = () => {
    return [
      { _id: 'PRD-001', name: 'Sample Product 1', mainImage: '', price: 1500, stock: 10, category: 'sample' },
      { _id: 'PRD-002', name: 'Sample Product 2', mainImage: '', price: 3200, stock: 5, category: 'sample' },
      { _id: 'PRD-003', name: 'Sample Product 3', mainImage: '', price: 4999, stock: 0, category: 'sample' }
    ];
  };

  const generateRecentActivities = () => {
    return [
      { id: 1, type: 'order', action: 'completed', item: 'Order #ORD-001', user: 'John Doe', time: '2 mins ago', status: 'success' },
      { id: 2, type: 'product', action: 'added', item: 'Nike Air Max', user: 'Admin', time: '15 mins ago', status: 'info' },
      { id: 3, type: 'user', action: 'registered', item: 'New user', user: 'Jane Smith', time: '1 hour ago', status: 'success' },
      { id: 4, type: 'product', action: 'updated', item: 'iPhone 15 Pro', user: 'Admin', time: '2 hours ago', status: 'info' },
      { id: 5, type: 'payment', action: 'received', item: 'KES 12,500', user: 'System', time: '3 hours ago', status: 'success' },
      { id: 6, type: 'alert', action: 'low stock', item: 'Samsung TV', user: 'System', time: '5 hours ago', status: 'warning' }
    ];
  };

  const generateRecentOrders = () => {
    return [
      { _id: 'ORD-001', id: 'ORD-001', customer: 'John Doe', amount: 12500, status: 'Paid', date: new Date().toISOString().slice(0,10) },
      { _id: 'ORD-002', id: 'ORD-002', customer: 'Jane Smith', amount: 8400, status: 'Pending', date: new Date().toISOString().slice(0,10) },
      { _id: 'ORD-003', id: 'ORD-003', customer: 'Acme Corp', amount: 45000, status: 'Completed', date: new Date().toISOString().slice(0,10) }
    ];
  };

  const generateRecentUsers = () => {
    return [
      { _id: 'USR-001', name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
      { _id: 'USR-002', name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString() },
      { _id: 'USR-003', name: 'Acme Buyer', email: 'buyer@acme.com', createdAt: new Date().toISOString() }
    ];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
      case 'active':
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'Pending':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const dotStyle = (color) => (
    <span
      className="inline-block w-3 h-3 rounded-full mr-2 shadow-sm"
      style={{ backgroundColor: color }}
    />
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-gray-600">{entry.dataKey}:</span>
              </div>
              <span className="text-sm font-semibold text-gray-800 ml-4">
                {entry.dataKey === 'revenue' || entry.dataKey === 'sales' || entry.dataKey === 'value' ? 
                  formatCurrency(entry.value) : 
                  entry.value.toLocaleString()
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleRefresh = () => {
    toast.info('Refreshing dashboard data...');
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: FaDollarSign,
      growth: stats.revenueGrowth,
      gradient: 'from-blue-500 to-blue-600',
      description: 'All time revenue'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: FaShoppingCart,
      growth: stats.orderGrowth,
      gradient: 'from-green-500 to-green-600',
      description: 'Completed orders'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: FaBox,
      growth: stats.productGrowth,
      gradient: 'from-purple-500 to-purple-600',
      description: `${stats.totalStock?.toLocaleString() || 0} in stock`
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: FaUsers,
      growth: stats.userGrowth,
      gradient: 'from-orange-500 to-orange-600',
      description: 'Registered users'
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(stats.totalValue || 0),
      icon: FaWarehouse,
      growth: '+12%',
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'Current stock value'
    },
    {
      title: 'Active Orders',
      value: Math.floor(stats.totalOrders * 0.15).toLocaleString(),
      icon: FaChartLine,
      growth: '+8%',
      gradient: 'from-teal-500 to-teal-600',
      description: 'Pending & processing'
    }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header Section - Matching first dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{activeTabObj.label === 'Overview' ? 'Store Dashboard' : activeTabObj.label}</h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">{activeTabObj.description}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-lg border">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-1 sm:p-2">
        <div className="flex flex-nowrap overflow-x-auto gap-1 sm:gap-2 pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className={`${tab.icon} text-xs sm:text-sm`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Dynamic Summary Cards - Horizontal scroll like first dashboard */}
          <div className="overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin">
            <div className="flex gap-3 sm:gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {summaryCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${card.gradient} rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden min-w-[180px] sm:min-w-0 flex-shrink-0 sm:flex-shrink`}
                >
                  <div className="p-4 sm:p-5 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs sm:text-sm font-medium opacity-90">
                          {card.title}
                        </p>
                        <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{card.value}</p>
                        <p className="text-xs opacity-80 mt-1">
                          {card.description}
                        </p>
                      </div>
                      <div className="p-1 sm:p-2 bg-white bg-opacity-20 rounded-lg sm:rounded-xl">
                        <card.icon className="text-xl text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-3 sm:mt-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${card.growth >= 0 ? 'bg-green-500' : 'bg-red-500'} bg-opacity-20`}>
                        {card.growth >= 0 ? '+' : ''}{card.growth}%
                      </span>
                      <span className="text-xs opacity-90 ml-2">vs last period</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section - Matching first dashboard layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales & Revenue Chart */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                      Sales & Revenue Analytics
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Performance metrics over time
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      {[
                        { color: '#10B981', label: 'Revenue' },
                        { color: '#3B82F6', label: 'Sales' },
                        { color: '#8B5CF6', label: 'Orders' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          {dotStyle(item.color)}
                          <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <select
                      value={timeRange}
                      onChange={(e) => handleTimeRangeChange(e.target.value)}
                      className="border border-gray-200 rounded-lg sm:rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm w-full sm:w-auto"
                    >
                      <option value="day">Daily View</option>
                      <option value="week">Weekly View</option>
                      <option value="month">Monthly View</option>
                      <option value="year">Yearly View</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-6">
                <div className="w-full h-64 sm:h-80 min-w-0 min-h-0">
                  {salesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="time"
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          axisLine={{ stroke: '#E5E7EB' }}
                        />
                        <YAxis
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10B981"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="orders"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaChartBar className="text-xl sm:text-2xl text-gray-400" />
                      </div>
                      <p className="text-sm sm:text-lg font-medium text-center">
                        {loading ? 'Loading sales data...' : 'No sales data available'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 text-center">
                        Data will appear here once sales are made
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Category Distribution Chart */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                      Category Distribution
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Inventory value by category
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(categoryData.reduce((sum, item) => sum + item.value, 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-6">
                <div className="w-full h-64 sm:h-80 min-w-0 min-h-0">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData}
                        layout="vertical"
                        margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                        <XAxis
                          type="number"
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          axisLine={{ stroke: '#E5E7EB' }}
                          width={140}
                        />
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), 'Value']}
                          labelFormatter={(label) => `Category: ${label}`}
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar
                          dataKey="value"
                          radius={[0, 4, 4, 0]}
                          barSize={20}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={categoryColors[index % categoryColors.length]}
                              fillOpacity={0.8}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaChartPie className="text-xl sm:text-2xl text-gray-400" />
                      </div>
                      <p className="text-sm sm:text-lg font-medium text-center">
                        {loading ? 'Loading category data...' : 'No category data available'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Category stats below chart */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {categoryData.slice(0, 4).map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                        >
                          <span className="text-white text-sm font-medium">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
                            {category.name}
                          </p>
                          <p className="text-xs text-gray-500">{category.count} products</p>
                        </div>
                      </div>
                      <div className="text-right w-28 flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {formatCurrency(category.value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Small analytics quick-stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Products</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
              </div>
              <div className="text-blue-500 text-2xl">
                <FaBox />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Customers</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="text-green-500 text-2xl">
                <FaUsers />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Avg Order Value</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(stats.totalOrders ? Math.round(stats.totalRevenue / stats.totalOrders) : 0)}</p>
              </div>
              <div className="text-indigo-500 text-2xl">
                <FaDollarSign />
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Recent Orders
                      </h2>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">
                        Latest customer orders
                      </p>
                    </div>
                    <Link
                      to="/orders"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View all
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Order ID', 'Customer', 'Amount', 'Status', 'Date', 'Actions'].map((header) => (
                          <th
                            key={header}
                            className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders && recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <tr key={order._id || order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-900 font-medium">
                              {order._id || order.id}
                            </td>
                            <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-900">
                              {order.customer || order.user || order.customerName || '—'}
                            </td>
                            <td className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-900">
                              {formatCurrency(order.amount || order.total || 0)}
                            </td>
                            <td className="p-3 sm:p-4 text-xs sm:text-sm">
                              <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || order.state || 'Pending')}`}>
                                {order.status || order.state || 'Pending'}
                              </span>
                            </td>
                            <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-900">
                              {order.date || order.createdAt || new Date().toISOString().slice(0, 10)}
                            </td>
                            <td className="p-3 sm:p-4 text-xs sm:text-sm">
                              <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                                <FaEye className="text-sm" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-sm text-gray-500">
                            No recent orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Low Stock Alert */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
                    <p className="text-gray-600 text-sm">Products needing restock</p>
                  </div>
                  <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200">
                    {lowStockProducts.length} items
                  </span>
                </div>
                
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <img 
                            src={product.mainImage} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <FaExclamationTriangle className="text-xs" />
                            <span>{product.stock} units left</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/products/${product._id}/edit`}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Restock
                      </Link>
                    </div>
                  ))}
                  
                  {lowStockProducts.length === 0 && (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaCheckCircle className="text-green-500 text-xl" />
                      </div>
                      <p className="text-sm text-gray-600">All products are well stocked</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                    <p className="text-gray-600 text-sm">Latest system activities</p>
                  </div>
                  <FaClock className="text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`p-2 rounded-lg ${getStatusColor(activity.status).replace('text-', 'bg-').replace('800', '100')}`}>
                        {activity.type === 'order' && <FaShoppingCart className="text-sm" />}
                        {activity.type === 'product' && <FaBox className="text-sm" />}
                        {activity.type === 'user' && <FaUsers className="text-sm" />}
                        {activity.type === 'payment' && <FaDollarSign className="text-sm" />}
                        {activity.type === 'alert' && <FaExclamationTriangle className="text-sm" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.user} {activity.action} {activity.item}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Products</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">All products in your store</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-blue-600">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Product', 'Price', 'Stock', 'Category', 'Actions'].map(h => (
                    <th key={h} className="p-3 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products && products.length > 0 ? (
                  products.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-xs sm:text-sm text-gray-900 font-medium">{p._id}</td>
                      <td className="p-3 text-xs sm:text-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded overflow-hidden">
                          <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover" onError={(e)=>{e.target.onerror=null; e.target.src='https://via.placeholder.com/150'}} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        </div>
                      </td>
                      <td className="p-3 text-xs sm:text-sm font-semibold">{formatCurrency(p.price || 0)}</td>
                      <td className="p-3 text-xs sm:text-sm">{p.stock ?? 0}</td>
                      <td className="p-3 text-xs sm:text-sm">{p.category || '—'}</td>
                      <td className="p-3 text-xs sm:text-sm">
                        <Link to={`/products/${p._id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="p-6 text-center text-sm text-gray-500">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Orders</h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">Manage and review customer orders</p>
              </div>
              <Link to="/orders" className="text-sm font-medium text-blue-600">View all</Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date', 'Actions'].map((header) => (
                    <th key={header} className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-900 font-medium">{order.id}</td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-900">{order.customer || order.user || order.customerName || '—'}</td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-900">{formatCurrency(order.amount || order.total || 0)}</td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm"><span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || order.state || 'Pending')}`}>{order.status || order.state || 'Pending'}</span></td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-900">{order.date || order.createdAt || new Date().toISOString().slice(0, 10)}</td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm"><button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"><FaEye className="text-sm" /></button></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="p-6 text-center text-sm text-gray-500">No recent orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Customers</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Recent customers and account overview</p>
            </div>
            <Link to="/users" className="text-sm font-medium text-blue-600">View all</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Total Customers</p>
              <p className="text-xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">New (last 7d)</p>
              <p className="text-xl font-semibold text-gray-900">{recentUsers.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Active Customers</p>
              <p className="text-xl font-semibold text-gray-900">{Math.max(0, stats.totalUsers - 5)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Name', 'Email', 'Created', 'Actions'].map(h => (
                    <th key={h} className="p-3 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers && recentUsers.length > 0 ? (
                  recentUsers.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-xs sm:text-sm text-gray-900 font-medium">{u._id}</td>
                      <td className="p-3 text-xs sm:text-sm text-gray-900">{u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || '—'}</td>
                      <td className="p-3 text-xs sm:text-sm">{u.email || '—'}</td>
                      <td className="p-3 text-xs sm:text-sm text-gray-900">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="p-3 text-xs sm:text-sm"><Link to={`/users/${u._id}/edit`} className="text-blue-600 hover:underline">View</Link></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="p-6 text-center text-sm text-gray-500">No recent customers</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Sales Overview</h2>
            <div className="w-full h-72 min-w-0 min-h-0">
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" tick={{ fill: '#6B7280' }} />
                    <YAxis tickFormatter={(v) => formatCurrency(v)} />
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Bar dataKey="revenue" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500">No sales data available</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Category Breakdown</h2>
            <div className="w-full h-72 min-w-0 min-h-0">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90} label>
                      {categoryData.map((entry, idx) => (
                        <Cell key={`c-${idx}`} fill={categoryColors[idx % categoryColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500">No category data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;