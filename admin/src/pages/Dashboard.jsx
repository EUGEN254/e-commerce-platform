// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
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
  FaDownload,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaTruck,
  FaWarehouse,
  FaCreditCard,
  FaPercent,
  FaFilter,
  FaCalendarAlt,
  FaSync,
  FaChartBar,
  FaChartPie
} from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency';

// Import Recharts components
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar
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

  // Professional color palette
  const colors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    warning: '#F59E0B',
    danger: '#EF4444',
    dark: '#1F2937',
    light: '#F9FAFB'
  };

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

  const gradientColors = {
    sales: { start: '#3B82F6', end: '#8B5CF6' },
    orders: { start: '#10B981', end: '#34D399' },
    revenue: { start: '#F59E0B', end: '#FBBF24' }
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

      // Sales data
      try {
        const salesRes = await getSalesData(timeRange);
        setSalesData(salesRes.data?.data || salesRes.data || generateSalesData(timeRange));
      } catch (e) {
        console.warn('getSalesData failed, using generated sales data', e?.message || e);
        setSalesData(generateSalesData(timeRange));
      }

      // Category distribution
      try {
        const catRes = await getCategoryDistribution();
        setCategoryData(catRes.data?.data || catRes.data || generateCategoryData(products));
      } catch (e) {
        console.warn('getCategoryDistribution failed, using generated category data', e?.message || e);
        setCategoryData(generateCategoryData(products));
      }

      // Recent orders
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
        for (let i = 1; i <= 30; i += 2) {
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

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'active':
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.dataKey}:</span>
              </div>
              <span className="text-sm font-semibold text-gray-800 ml-4">
                {entry.dataKey === 'sales' || entry.dataKey === 'revenue' ? 
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

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid - Professional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue),
            icon: FaDollarSign,
            growth: stats.revenueGrowth,
            color: 'from-blue-500 to-blue-600',
            iconColor: 'text-blue-100',
            bgColor: 'bg-blue-500/10'
          },
          {
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            icon: FaShoppingCart,
            growth: stats.orderGrowth,
            color: 'from-green-500 to-green-600',
            iconColor: 'text-green-100',
            bgColor: 'bg-green-500/10'
          },
          {
            title: 'Total Products',
            value: stats.totalProducts.toLocaleString(),
            icon: FaBox,
            growth: stats.productGrowth,
            color: 'from-purple-500 to-purple-600',
            iconColor: 'text-purple-100',
            bgColor: 'bg-purple-500/10',
            subValue: `${stats.totalStock?.toLocaleString() || 0} in stock`
          },
          {
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: FaUsers,
            growth: stats.userGrowth,
            color: 'from-orange-500 to-orange-600',
            iconColor: 'text-orange-100',
            bgColor: 'bg-orange-500/10'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`text-xl ${stat.iconColor}`} />
              </div>
              <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                stat.growth >= 0 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {stat.growth >= 0 ? (
                  <FaArrowUp className="text-xs" />
                ) : (
                  <FaArrowDown className="text-xs" />
                )}
                <span>{Math.abs(stat.growth)}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
            {stat.subValue && (
              <p className="text-xs text-gray-500">{stat.subValue}</p>
            )}
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Orders Chart - Improved */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales & Orders Overview</h3>
              <p className="text-sm text-gray-500">Performance metrics over time</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600" />
                <span className="text-sm text-gray-600">Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" />
                <span className="text-sm text-gray-600">Sales</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000) return `${value/1000}k`;
                    return value;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution - Improved */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
              <p className="text-sm text-gray-500">Inventory value by category</p>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {formatCurrency(categoryData.reduce((sum, item) => sum + item.value, 0))}
            </span>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                <XAxis 
                  type="number"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Value']}
                  labelFormatter={(label) => `Category: ${label}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={categoryColors[entry.name] || `hsl(${index * 40}, 70%, 60%)`}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            {categoryData.slice(0, 4).map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: categoryColors[category.name] || `hsl(${index * 40}, 70%, 60%)` }}
                  >
                    <span className="text-white text-sm font-medium">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize truncate">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500">{category.count} products</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(category.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <p className="text-sm text-gray-500">Latest customer orders</p>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {generateRecentOrders().map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-900">{order.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-700">{order.customer}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500">{order.date}</span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                          <FaEye className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Alerts & Top Products */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
                <p className="text-sm text-gray-500">Products needing restock</p>
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

          {/* Top Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                <p className="text-sm text-gray-500">By inventory value</p>
              </div>
              <FaFire className="text-orange-500" />
            </div>
            
            <div className="space-y-4">
              {topProducts.slice(0, 3).map((product, index) => (
                <div key={product._id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
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
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <span className="text-sm font-bold text-blue-600 whitespace-nowrap">
                        {formatCurrency(product.price * product.stock)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-500 text-xs" />
                        <span>{product.rating || '0.0'}/5</span>
                      </div>
                      <span className="font-medium">{product.stock} in stock</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Inventory Value',
            value: formatCurrency(stats.totalValue || 0),
            icon: FaWarehouse,
            color: 'bg-blue-500',
            trend: '+12%'
          },
          {
            title: 'Avg. Order Value',
            value: stats.totalOrders ? formatCurrency(stats.totalRevenue / stats.totalOrders) : formatCurrency(0),
            icon: FaCreditCard,
            color: 'bg-green-500',
            trend: '+5%'
          },
          {
            title: 'Conversion Rate',
            value: stats.totalOrders && stats.totalUsers ? 
              `${((stats.totalOrders / stats.totalUsers) * 100).toFixed(1)}%` : 
              '0%',
            icon: FaPercent,
            color: 'bg-purple-500',
            trend: '+2.3%'
          },
          {
            title: 'Fulfillment Rate',
            value: '98.5%',
            icon: FaTruck,
            color: 'bg-orange-500',
            trend: '+0.5%'
          }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}>
                <metric.icon className={`text-lg ${metric.color.replace('bg-', 'text-')}`} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {metric.trend}
              </span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">{metric.value}</h4>
            <p className="text-sm text-gray-600">{metric.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;