// src/pages/orders/OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaUser, 
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendar,
  FaClock,
  FaCheck,
  FaTimes,
  FaTruck,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaPrint,
  FaDownload,
  FaEdit,
  FaTrash,
  FaHistory,
  FaBox,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaTag
} from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatCurrency';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState([]);

  // Load order data
  useEffect(() => {
    loadOrderData();
    loadActivityLogs();
  }, [id]);

  const loadOrderData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrder = {
        _id: id,
        orderNumber: 'ORD-2024-001',
        userId: 'user1',
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+254712345678'
        },
        items: [
          {
            productId: 'prod1',
            name: 'iPhone 15 Pro Max',
            price: 1199.99,
            quantity: 1,
            Subtotal: 1199.99,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150',
            sku: 'IPH15PM-256-BLK'
          },
          {
            productId: 'prod2',
            name: 'AirPods Pro',
            price: 249.99,
            quantity: 1,
            Subtotal: 249.99,
            image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?auto=format&fit=crop&w=150',
            sku: 'AIRPODS-PRO-2'
          },
          {
            productId: 'prod9',
            name: 'Apple Watch Series 9',
            price: 399.99,
            quantity: 1,
            Subtotal: 399.99,
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150',
            sku: 'AW-S9-41MM'
          }
        ],
        subtotal: 1849.97,
        tax: 184.99,
        shippingFee: 9.99,
        totalAmount: 2044.95,
        currency: 'KES',
        status: 'PAID',
        paymentStatus: 'PAID',
        transactionId: 'trans_001',
        shippingAddress: {
          fullName: 'John Doe',
          phone: '+254712345678',
          address: '123 Main Street, Westlands',
          city: 'Nairobi',
          country: 'Kenya',
          postalCode: '00100'
        },
        billingAddress: {
          fullName: 'John Doe',
          phone: '+254712345678',
          address: '123 Main Street, Westlands',
          city: 'Nairobi',
          country: 'Kenya',
          postalCode: '00100'
        },
        paymentMethod: 'M-Pesa',
        shippingMethod: 'Express Delivery',
        trackingNumber: 'TRK-789456123',
        notes: 'Please deliver before 5 PM',
        expiresAt: null,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T14:20:00Z'
      };
      
      setOrder(mockOrder);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    const mockLogs = [
      { id: 1, action: 'Order Created', timestamp: '2024-01-15T10:30:00Z', user: 'System' },
      { id: 2, action: 'Payment Received', timestamp: '2024-01-15T10:35:00Z', user: 'M-Pesa', details: 'Transaction ID: MP123456' },
      { id: 3, action: 'Order Processed', timestamp: '2024-01-15T14:20:00Z', user: 'Admin User' },
      { id: 4, action: 'Shipped', timestamp: '2024-01-16T09:15:00Z', user: 'Warehouse', details: 'Tracking: TRK-789456123' },
      { id: 5, action: 'Status Updated', timestamp: '2024-01-16T14:20:00Z', user: 'System', details: 'Changed to FULFILLED' },
    ];
    
    setActivityLogs(mockLogs);
  };

  const handleUpdateStatus = (newStatus) => {
    setOrder(prev => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }));
    
    // Add activity log
    const newLog = {
      id: activityLogs.length + 1,
      action: 'Status Updated',
      timestamp: new Date().toISOString(),
      user: 'Admin',
      details: `Changed status to ${newStatus}`
    };
    
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteOrder = () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      navigate('/orders');
    }
  };

  // Use shared formatter

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </button>
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
              <button
                onClick={() => navigate('/orders')}
                className="p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-2xl font-bold">Order Details</h2>
            </div>
            <p className="text-blue-100">View and manage order information</p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">Order Number</p>
              <p className="text-xl font-bold">{order.orderNumber}</p>
            </div>
            <FaShoppingCart className="text-3xl opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Order Status</h3>
                <p className="text-gray-600">Track the progress of this order</p>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className={`px-4 py-2 rounded-full font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCheck className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Order Placed</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCreditCard className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Payment Confirmed</p>
                    <p className="text-sm text-gray-500">{order.paymentStatus === 'PAID' ? formatDate(order.updatedAt) : 'Pending'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    order.status === 'FULFILLED' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <FaTruck className={order.status === 'FULFILLED' ? 'text-green-600' : 'text-gray-400'} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Order Fulfilled</p>
                    <p className="text-sm text-gray-500">
                      {order.status === 'FULFILLED' ? formatDate(order.updatedAt) : 'In Progress'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-4">Update Status</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus('PAYMENT_PENDING')}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  Mark as Payment Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus('PAID')}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Mark as Paid
                </button>
                <button
                  onClick={() => handleUpdateStatus('FULFILLED')}
                  className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Mark as Fulfilled
                </button>
                <button
                  onClick={() => handleUpdateStatus('CANCELLED')}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
              <FaShoppingCart className="text-blue-500" />
              <span>Order Items ({order.items.length})</span>
            </h3>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500">SKU: {item.sku}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">Product ID: {item.productId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="font-medium text-blue-600 mt-1">{formatCurrency(item.Subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="max-w-md ml-auto">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-medium">{formatCurrency(order.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Currency</span>
                    <span>{order.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
              <FaHistory className="text-blue-500" />
              <span>Activity Log</span>
            </h3>

            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaTag className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{log.action}</p>
                        {log.details && (
                          <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatDate(log.timestamp)}</p>
                        <p className="text-xs text-gray-400">{log.user}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Customer & Shipping */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
              <FaUser className="text-blue-500" />
              <span>Customer Information</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{order.user.name}</p>
                  <p className="text-sm text-gray-600">{order.user.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-gray-700">{order.user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-400" />
                  <span className="text-gray-700">{order.user.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaTag className="text-gray-400" />
                  <span className="text-gray-700">User ID: {order.userId}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Link
                  to={`/users/${order.userId}`}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaUser />
                  <span>View Customer Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <span>Shipping Information</span>
            </h3>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600 mt-1">{order.shippingAddress.address}</p>
                <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
              </div>

              <div className="flex items-center space-x-3">
                <FaPhone className="text-gray-400" />
                <span className="text-gray-700">{order.shippingAddress.phone}</span>
              </div>

              {order.shippingMethod && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Shipping Method</h4>
                  <p className="text-gray-600">{order.shippingMethod}</p>
                </div>
              )}

              {order.trackingNumber && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Tracking Information</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tracking #:</span>
                    <span className="font-medium text-blue-600">{order.trackingNumber}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
              <FaCreditCard className="text-blue-500" />
              <span>Payment Information</span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Method</span>
                <span className="font-medium">{order.paymentMethod || 'Not specified'}</span>
              </div>

              {order.transactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium text-blue-600">{order.transactionId}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-bold text-green-600">{formatCurrency(order.totalAmount)}</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Billing Address</h4>
                <p className="text-gray-600">{order.billingAddress?.fullName || order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.billingAddress?.address || order.shippingAddress.address}</p>
                <p className="text-gray-600">{order.billingAddress?.city || order.shippingAddress.city}</p>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Order Actions</h3>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaPrint />
                <span>Print Invoice</span>
              </button>

              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <FaDownload />
                <span>Download PDF</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/orders/${order._id}/edit`}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  <FaEdit />
                  <span>Edit</span>
                </Link>

                <button
                  onClick={handleDeleteOrder}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Notes</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;