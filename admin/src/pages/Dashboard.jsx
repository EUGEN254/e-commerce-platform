// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaUsers,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaFire,
  FaTag,
  FaCalendar,
  FaEye,
  FaDownload,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaTruck,
  FaWarehouse,
  FaCreditCard,
  FaPercent,
  FaSpinner
} from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';

// Import Recharts components
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Import services

import { getDashboardStats, getRecentActivities, getSalesData, getCategoryDistribution } from '../services/dashboardService';
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
  const { fetchProducts: getProducts } = useProducts();
  const [categoryData, setCategoryData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // day, week, month, year

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const categoryColors = {
    'shoes': '#FF6B6B',
    'clothing': '#4ECDC4',
    'electronics': '#45B7D1',
    'accessories': '#96CEB4',
    'home': '#FECA57',
    'mobile': '#54A0FF',
    'beauty': '#FF9FF3',
    'sports': '#1DD1A1',
    'books': '#F368E0',
    'fashion': '#FF9F43'
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch products for inventory stats
      const productsResponse = await getProducts({ limit: 1000 });
      const products = productsResponse.data?.data || [];
      
      // Calculate product stats
      const productStats = calculateProductStats(products);
      // Start building stats using API when available
      let apiStats = {};
      try {
        const res = await getDashboardStats();
        apiStats = res.data?.data || res.data || {};
      } catch (e) {
        console.warn('getDashboardStats failed, falling back to mock values', e?.message || e);
      }

      const combinedStats = {
        totalProducts: products.length,
        totalOrders: apiStats.totalOrders || 0,
        totalRevenue: apiStats.totalRevenue || productStats.totalValue || 0,
        totalUsers: apiStats.totalUsers || 0,
        revenueGrowth: apiStats.revenueGrowth || 0,
        orderGrowth: apiStats.orderGrowth || 0,
        userGrowth: apiStats.userGrowth || 0,
        productGrowth: apiStats.productGrowth || 0,
        ...productStats
      };

      setStats(combinedStats);

      // Sales data (try API, fallback to generated)
      try {
        const salesRes = await getSalesData(timeRange);
        setSalesData(salesRes.data?.data || salesRes.data || generateSalesData(timeRange));
      } catch (e) {
        console.warn('getSalesData failed, using generated sales data', e?.message || e);
        setSalesData(generateSalesData(timeRange));
      }

      // Category distribution (try API, fallback to generated)
      try {
        const catRes = await getCategoryDistribution();
        setCategoryData(catRes.data?.data || catRes.data || generateCategoryData(products));
      } catch (e) {
        console.warn('getCategoryDistribution failed, using generated category data', e?.message || e);
        setCategoryData(generateCategoryData(products));
      }

      // Recent orders - try to use recent activities API for better data
      try {
        const actRes = await getRecentActivities();
        const acts = actRes.data?.data || actRes.data || generateRecentActivities();
        setRecentActivities(acts.slice(0, 10));
      } catch (e) {
        console.warn('getRecentActivities failed, using generated activities', e?.message || e);
        setRecentActivities(generateRecentActivities());
      }

      // Low stock and top products from local products list
      const lowStock = products
        .filter(p => p.stock <= 10 && p.stock > 0)
        .slice(0, 5);
      setLowStockProducts(lowStock);

      const top = products
        .slice()
        .sort((a, b) => (b.price || 0) * (b.stock || 0) - ((a.price || 0) * (a.stock || 0)))
        .slice(0, 5);
      setTopProducts(top);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate product stats
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

  // Generate sales data based on time range
  const generateSalesData = (range) => {
    const data = [];
    const now = new Date();
    
    switch (range) {
      case 'day':
        for (let i = 0; i < 24; i++) {
          data.push({
            name: `${i}:00`,
            sales: Math.floor(Math.random() * 5000) + 1000,
            orders: Math.floor(Math.random() * 20) + 5
          });
        }
        break;
      case 'week':
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach(day => {
          data.push({
            name: day,
            sales: Math.floor(Math.random() * 30000) + 5000,
            orders: Math.floor(Math.random() * 50) + 10
          });
        });
        break;
      case 'month':
        for (let i = 1; i <= 30; i++) {
          data.push({
            name: `Day ${i}`,
            sales: Math.floor(Math.random() * 25000) + 3000,
            orders: Math.floor(Math.random() * 40) + 8
          });
        }
        break;
      case 'year':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach(month => {
          data.push({
            name: month,
            sales: Math.floor(Math.random() * 150000) + 20000,
            orders: Math.floor(Math.random() * 200) + 50
          });
        });
        break;
      default:
        break;
    }
    
    return data;
  };

  // Generate category data
  const generateCategoryData = (products) => {
    const categoryMap = {};
    
    products.forEach(product => {
      const category = product.category || 'uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          value: 0,
          count: 0
        };
      }
      categoryMap[category].value += (product.price || 0) * (product.stock || 0);
      categoryMap[category].count++;
    });
    
    return Object.values(categoryMap)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  // Generate recent orders
  const generateRecentOrders = () => {
    return [
      { id: '#ORD-001', customer: 'John Doe', amount: 12500, status: 'Paid', date: '2024-01-15' },
      { id: '#ORD-002', customer: 'Jane Smith', amount: 8900, status: 'Pending', date: '2024-01-15' },
      { id: '#ORD-003', customer: 'Bob Johnson', amount: 15600, status: 'Paid', date: '2024-01-14' },
      { id: '#ORD-004', customer: 'Alice Brown', amount: 7200, status: 'Cancelled', date: '2024-01-14' },
      { id: '#ORD-005', customer: 'Charlie Wilson', amount: 18900, status: 'Paid', date: '2024-01-13' }
    ];
  };

  // Generate recent activities
  const generateRecentActivities = () => {
    return [
      { id: 1, type: 'product', action: 'added', item: 'Nike Air Max', user: 'Admin', time: '2 mins ago' },
      { id: 2, type: 'order', action: 'completed', item: 'Order #ORD-001', user: 'John Doe', time: '15 mins ago' },
      { id: 3, type: 'user', action: 'registered', item: 'New user', user: 'Jane Smith', time: '1 hour ago' },
      { id: 4, type: 'product', action: 'updated', item: 'iPhone 15 Pro', user: 'Admin', time: '2 hours ago' },
      { id: 5, type: 'payment', action: 'received', item: 'KES 12,500', user: 'System', time: '3 hours ago' }
    ];
  };

  // Use shared formatter

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'active':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'shoes': return '👟';
      case 'electronics': return '💻';
      case 'clothing': return '👕';
      case 'mobile': return '📱';
      case 'accessories': return '🕶️';
      case 'home': return '🏠';
      case 'beauty': return '💄';
      case 'sports': return '⚽';
      case 'books': return '📚';
      case 'fashion': return '👗';
      default: return '📦';
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Re-fetch dashboard data which will load sales for the new range
    fetchDashboardData();
  };

  // Refresh dashboard
  const handleRefresh = () => {
    toast.info('Refreshing dashboard data...');
    fetchDashboardData();
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FaChartLine className="text-3xl" />
              <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            </div>
            <p className="text-blue-100">
              Welcome to your e-commerce dashboard. Here's what's happening today.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-wrap items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <  FaCheckCircle />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaDollarSign className="text-blue-600 text-2xl" />
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${stats.revenueGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {stats.revenueGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(stats.revenueGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</h3>
          <p className="text-gray-500 mt-1">Total Revenue</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaShoppingCart className="text-green-600 text-2xl" />
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${stats.orderGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {stats.orderGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(stats.orderGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders.toLocaleString()}</h3>
          <p className="text-gray-500 mt-1">Total Orders</p>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaBox className="text-purple-600 text-2xl" />
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${stats.productGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {stats.productGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(stats.productGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalProducts.toLocaleString()}</h3>
          <p className="text-gray-500 mt-1">Total Products</p>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-green-600">
              <FaCheckCircle className="inline mr-1" />
              {stats.featuredCount || 0} featured
            </span>
            <span className="text-blue-600">
              <FaWarehouse className="inline mr-1" />
              {stats.totalStock || 0} in stock
            </span>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FaUsers className="text-orange-600 text-2xl" />
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${stats.userGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {stats.userGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(stats.userGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</h3>
          <p className="text-gray-500 mt-1">Total Users</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Sales & Orders Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Sales</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  tickFormatter={(value) => `KES ${value/1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Inventory by Category</h3>
            <span className="text-sm text-gray-500">
              Total Value: {formatCurrency(categoryData.reduce((sum, item) => sum + item.value, 0))}
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={categoryColors[entry.name] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Value']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {categoryData.slice(0, 4).map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getCategoryIcon(category.name)}</span>
                  <span className="text-sm font-medium text-gray-700 capitalize">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatCurrency(category.value)}</p>
                  <p className="text-xs text-gray-500">{category.count} products</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            <Link to="/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Order ID</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Customer</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Amount</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Date</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-blue-600">{order.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{order.customer}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-800">{formatCurrency(order.amount)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-500">{order.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Low Stock Alert</h3>
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                {lowStockProducts.length} items
              </span>
            </div>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={product.mainImage} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 truncate max-w-[120px]">{product.name}</p>
                      <p className="text-sm text-red-600">
                        <FaExclamationTriangle className="inline mr-1" />
                        {product.stock} units left
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/products/${product._id}/edit`}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Restock
                  </Link>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="text-center py-4">
                  <FaCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
                  <p className="text-gray-500">All products are well stocked</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Top Products</h3>
              <FaFire className="text-orange-500" />
            </div>
            <div className="space-y-4">
              {topProducts.slice(0, 3).map((product, index) => (
                <div key={product._id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={product.mainImage} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800 truncate">{product.name}</p>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(product.price * product.stock)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span>{product.rating || 0}/5</span>
                      </div>
                      <span>{product.stock} in stock</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FaWarehouse className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-blue-100">Inventory Value</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalValue || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FaPercent className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-green-100">Conversion Rate</p>
              <p className="text-2xl font-bold">
                {stats.totalOrders && stats.totalUsers ? 
                  `${((stats.totalOrders / stats.totalUsers) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FaCreditCard className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-purple-100">Avg. Order Value</p>
              <p className="text-2xl font-bold">
                {stats.totalOrders ? 
                  formatCurrency(stats.totalRevenue / stats.totalOrders) : 
                  formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FaTruck className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-orange-100">Fulfillment Rate</p>
              <p className="text-2xl font-bold">98.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;