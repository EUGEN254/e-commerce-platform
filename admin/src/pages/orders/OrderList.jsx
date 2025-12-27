// src/pages/orders/OrdersList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaDownload,
  FaShoppingCart,
  FaUser,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendar,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheck,
  FaTimes,
  FaClock,
  FaTruck,
  FaCreditCard,
  FaPercent,
  FaBox,
  FaHistory,
  FaFileInvoiceDollar,
  FaChartLine
} from 'react-icons/fa';

const OrdersList = () => {
  // Mock data based on your Order model
  const [orders, setOrders] = useState([
    {
      _id: '1',
      orderNumber: 'ORD-2024-001',
      userId: 'user1',
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      items: [
        {
          productId: 'prod1',
          name: 'iPhone 15 Pro Max',
          price: 1199.99,
          quantity: 1,
          Subtotal: 1199.99
        },
        {
          productId: 'prod2',
          name: 'AirPods Pro',
          price: 249.99,
          quantity: 1,
          Subtotal: 249.99
        }
      ],
      subtotal: 1449.98,
      tax: 144.99,
      shippingFee: 9.99,
      totalAmount: 1604.96,
      currency: 'KES',
      status: 'PAID',
      paymentStatus: 'PAID',
      transactionId: 'trans1',
      shippingAddress: {
        fullName: 'John Doe',
        phone: '+254712345678',
        address: '123 Main Street',
        city: 'Nairobi',
        country: 'Kenya',
        postalCode: '00100'
      },
      expiresAt: null,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z'
    },
    {
      _id: '2',
      orderNumber: 'ORD-2024-002',
      userId: 'user2',
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      items: [
        {
          productId: 'prod3',
          name: 'Nike Air Max 270',
          price: 129.99,
          quantity: 2,
          Subtotal: 259.98
        }
      ],
      subtotal: 259.98,
      tax: 25.99,
      shippingFee: 5.99,
      totalAmount: 291.96,
      currency: 'KES',
      status: 'FULFILLED',
      paymentStatus: 'PAID',
      transactionId: 'trans2',
      shippingAddress: {
        fullName: 'Jane Smith',
        phone: '+254723456789',
        address: '456 Oak Avenue',
        city: 'Mombasa',
        country: 'Kenya',
        postalCode: '80100'
      },
      expiresAt: null,
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T09:15:00Z'
    },
    {
      _id: '3',
      orderNumber: 'ORD-2024-003',
      userId: 'user3',
      user: {
        name: 'Robert Johnson',
        email: 'robert@example.com'
      },
      items: [
        {
          productId: 'prod4',
          name: 'Samsung 4K Smart TV',
          price: 699.99,
          quantity: 1,
          Subtotal: 699.99
        },
        {
          productId: 'prod5',
          name: 'TV Wall Mount',
          price: 49.99,
          quantity: 1,
          Subtotal: 49.99
        }
      ],
      subtotal: 749.98,
      tax: 74.99,
      shippingFee: 19.99,
      totalAmount: 844.96,
      currency: 'KES',
      status: 'PAYMENT_PENDING',
      paymentStatus: 'UNPAID',
      transactionId: null,
      shippingAddress: {
        fullName: 'Robert Johnson',
        phone: '+254734567890',
        address: '789 Pine Road',
        city: 'Kisumu',
        country: 'Kenya',
        postalCode: '40100'
      },
      expiresAt: '2024-01-20T14:20:00Z',
      createdAt: '2024-01-14T11:45:00Z',
      updatedAt: '2024-01-14T16:30:00Z'
    },
    {
      _id: '4',
      orderNumber: 'ORD-2024-004',
      userId: 'user4',
      user: {
        name: 'Emily Davis',
        email: 'emily@example.com'
      },
      items: [
        {
          productId: 'prod6',
          name: 'Leather Jacket',
          price: 299.99,
          quantity: 1,
          Subtotal: 299.99
        },
        {
          productId: 'prod7',
          name: 'Jeans',
          price: 89.99,
          quantity: 2,
          Subtotal: 179.98
        }
      ],
      subtotal: 479.97,
      tax: 47.99,
      shippingFee: 7.99,
      totalAmount: 535.95,
      currency: 'KES',
      status: 'CREATED',
      paymentStatus: 'UNPAID',
      transactionId: null,
      shippingAddress: {
        fullName: 'Emily Davis',
        phone: '+254745678901',
        address: '321 Cedar Lane',
        city: 'Nakuru',
        country: 'Kenya',
        postalCode: '20100'
      },
      expiresAt: '2024-01-18T11:45:00Z',
      createdAt: '2024-01-13T09:20:00Z',
      updatedAt: '2024-01-13T14:45:00Z'
    },
    {
      _id: '5',
      orderNumber: 'ORD-2024-005',
      userId: 'user5',
      user: {
        name: 'Michael Wilson',
        email: 'michael@example.com'
      },
      items: [
        {
          productId: 'prod8',
          name: 'Wireless Headphones',
          price: 199.99,
          quantity: 1,
          Subtotal: 199.99
        }
      ],
      subtotal: 199.99,
      tax: 19.99,
      shippingFee: 4.99,
      totalAmount: 224.97,
      currency: 'KES',
      status: 'CANCELLED',
      paymentStatus: 'UNPAID',
      transactionId: null,
      shippingAddress: {
        fullName: 'Michael Wilson',
        phone: '+254756789012',
        address: '654 Birch Street',
        city: 'Eldoret',
        country: 'Kenya',
        postalCode: '30100'
      },
      expiresAt: null,
      createdAt: '2024-01-12T16:30:00Z',
      updatedAt: '2024-01-13T11:20:00Z'
    }
  ]);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Status options from your model
  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'CREATED', label: 'Created', color: 'blue' },
    { value: 'PAYMENT_PENDING', label: 'Payment Pending', color: 'yellow' },
    { value: 'PAID', label: 'Paid', color: 'green' },
    { value: 'FULFILLED', label: 'Fulfilled', color: 'purple' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
    { value: 'EXPIRED', label: 'Expired', color: 'gray' }
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'All Payment Status', color: 'gray' },
    { value: 'UNPAID', label: 'Unpaid', color: 'red' },
    { value: 'PARTIAL', label: 'Partial', color: 'yellow' },
    { value: 'PAID', label: 'Paid', color: 'green' },
    { value: 'REFUNDED', label: 'Refunded', color: 'blue' }
  ];

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        selectedStatus === 'all' || order.status === selectedStatus;
      
      const matchesPaymentStatus = 
        selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus;
      
      const matchesDateRange = () => {
        if (dateRange === 'all') return true;
        
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        
        switch(dateRange) {
          case 'today': return daysDiff === 0;
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          default: return true;
        }
      };
      
      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange();
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt' || sortField === 'updatedAt' || sortField === 'expiresAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Handle order selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order._id));
    }
  };

  // Handle order actions
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(order => order._id !== orderId));
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleUpdatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders(prev => prev.map(order => 
      order._id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
    ));
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400 text-xs" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="text-blue-500" /> 
      : <FaSortDown className="text-blue-500" />;
  };

  // Format currency
  const formatCurrency = (amount, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusMap = {
      'CREATED': 'bg-blue-100 text-blue-800',
      'PAYMENT_PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'FULFILLED': 'bg-purple-100 text-purple-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'EXPIRED': 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const statusMap = {
      'UNPAID': 'bg-red-100 text-red-800',
      'PARTIAL': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'REFUNDED': 'bg-blue-100 text-blue-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'PAYMENT_PENDING' || o.status === 'CREATED').length;
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Order Management</h2>
            <p className="text-blue-100">Track and manage customer orders</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Pending</p>
              <p className="text-2xl font-bold">{pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Payment Status Filter */}
            <div className="relative">
              <FaCreditCard className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {paymentStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Range Filter */}
            <div className="relative">
              <FaCalendar className="absolute left-3 top-3 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedOrders.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{selectedOrders.length} selected</span>
                <button 
                  onClick={() => {
                    if (window.confirm(`Update ${selectedOrders.length} orders to PAID?`)) {
                      setOrders(prev => prev.map(order => 
                        selectedOrders.includes(order._id) 
                          ? { ...order, status: 'PAID', paymentStatus: 'PAID' }
                          : order
                      ));
                      setSelectedOrders([]);
                    }
                  }}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Mark as Paid
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete ${selectedOrders.length} orders?`)) {
                      setOrders(prev => prev.filter(order => !selectedOrders.includes(order._id)));
                      setSelectedOrders([]);
                    }
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            )}
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FaDownload />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Average Order Value</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {totalOrders > 0 ? formatCurrency(totalRevenue / totalOrders) : formatCurrency(0)}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaChartLine className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Payment</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-2">{pendingOrders}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaClock className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Today's Orders</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-2">{todayOrders}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaShoppingCart className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('orderNumber')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Order</span>
                    {getSortIcon('orderNumber')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Customer</th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    {getSortIcon('totalAmount')}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Items</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Payment</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold text-gray-800">{order.orderNumber}</p>
                          <button
                            onClick={() => toggleOrderDetails(order._id)}
                            className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                          >
                            {expandedOrder === order._id ? 'Hide details' : 'View details'}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-800">{formatDate(order.createdAt)}</p>
                          {order.expiresAt && order.status === 'PAYMENT_PENDING' && (
                            <p className="text-xs text-red-600 mt-1">
                              Expires: {formatDate(order.expiresAt)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{order.user?.name}</p>
                            <p className="text-sm text-gray-500">{order.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold text-gray-800">{formatCurrency(order.totalAmount)}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span>Subtotal: {formatCurrency(order.subtotal)}</span>
                            <span>Tax: {formatCurrency(order.tax)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <FaShoppingCart className="text-gray-400" />
                          <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)} units</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                          >
                            {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleUpdatePaymentStatus(order._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getPaymentStatusColor(order.paymentStatus)}`}
                          >
                            {paymentStatusOptions.filter(opt => opt.value !== 'all').map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/orders/${order._id}`}
                            className="p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                            title="View Order"
                          >
                            <FaEye />
                          </Link>
                          
                          <Link
                            to={`/orders/${order._id}/edit`}
                            className="p-2 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                            title="Edit Order"
                          >
                            <FaEdit />
                          </Link>
                          
                          {order.status !== 'CANCELLED' && order.status !== 'FULFILLED' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, 'FULFILLED')}
                              className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
                              title="Mark as Fulfilled"
                            >
                              <FaTruck />
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
                            title="Delete Order"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Order Details */}
                    {expandedOrder === order._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="9" className="py-6 px-4">
                          <div className="pl-14">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Order Items */}
                              <div className="lg:col-span-2">
                                <h4 className="font-medium text-gray-800 mb-4 flex items-center space-x-2">
                                  <FaShoppingCart className="text-gray-400" />
                                  <span>Order Items ({order.items.length})</span>
                                </h4>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <table className="w-full">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Product</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Price</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Qty</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item, index) => (
                                        <tr key={index} className="border-t border-gray-100">
                                          <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                              <div className="w-10 h-10 bg-gray-100 rounded"></div>
                                              <div>
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">Product ID: {item.productId}</p>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="py-3 px-4">{formatCurrency(item.price)}</td>
                                          <td className="py-3 px-4">{item.quantity}</td>
                                          <td className="py-3 px-4 font-medium">{formatCurrency(item.Subtotal)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                      <tr>
                                        <td colSpan="3" className="py-3 px-4 text-right font-medium">Subtotal:</td>
                                        <td className="py-3 px-4 font-bold">{formatCurrency(order.subtotal)}</td>
                                      </tr>
                                      <tr>
                                        <td colSpan="3" className="py-3 px-4 text-right font-medium">Tax:</td>
                                        <td className="py-3 px-4 font-bold">{formatCurrency(order.tax)}</td>
                                      </tr>
                                      <tr>
                                        <td colSpan="3" className="py-3 px-4 text-right font-medium">Shipping:</td>
                                        <td className="py-3 px-4 font-bold">{formatCurrency(order.shippingFee)}</td>
                                      </tr>
                                      <tr>
                                        <td colSpan="3" className="py-3 px-4 text-right font-bold text-lg">Total:</td>
                                        <td className="py-3 px-4 font-bold text-lg text-blue-600">{formatCurrency(order.totalAmount)}</td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              </div>

                              {/* Shipping & Info */}
                              <div className="space-y-6">
                                {/* Shipping Address */}
                                <div>
                                  <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <span>Shipping Address</span>
                                  </h4>
                                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                                    <p className="text-sm text-gray-600 mt-1">{order.shippingAddress.address}</p>
                                    <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                    <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                                    <p className="text-sm text-gray-600 mt-2">{order.shippingAddress.phone}</p>
                                  </div>
                                </div>

                                {/* Order Information */}
                                <div>
                                  <h4 className="font-medium text-gray-800 mb-3">Order Information</h4>
                                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-600">Order Created:</span>
                                      <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-600">Last Updated:</span>
                                      <span className="text-sm font-medium">{formatDate(order.updatedAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-600">Currency:</span>
                                      <span className="text-sm font-medium">{order.currency}</span>
                                    </div>
                                    {order.transactionId && (
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Transaction ID:</span>
                                        <span className="text-sm font-medium">{order.transactionId}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FaShoppingCart className="text-4xl text-gray-300" />
                      <p>No orders found</p>
                      {searchTerm && (
                        <p className="text-sm">Try adjusting your search or filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded">1</span>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Order Status Distribution</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Analytics →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statusOptions.filter(s => s.value !== 'all').map(status => {
            const count = orders.filter(o => o.status === status.value).length;
            const percentage = (count / totalOrders) * 100;
            
            return (
              <div key={status.value} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${status.color === 'blue' ? 'bg-blue-100' : status.color === 'green' ? 'bg-green-100' : status.color === 'yellow' ? 'bg-yellow-100' : status.color === 'red' ? 'bg-red-100' : status.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  <span className={`text-xl font-bold ${
                    status.color === 'blue' ? 'text-blue-600' :
                    status.color === 'green' ? 'text-green-600' :
                    status.color === 'yellow' ? 'text-yellow-600' :
                    status.color === 'red' ? 'text-red-600' :
                    status.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {count}
                  </span>
                </div>
                <p className="font-medium text-gray-800">{status.label}</p>
                <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;