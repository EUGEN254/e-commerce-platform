// Admin Dashboard Controller
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";
import Transaction from "../../models/Transaction.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      totalUsers,
      recentOrders,
      lowStockProducts,
      categories
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Transaction.aggregate([
        { $match: { status: "SUCCESS" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      User.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5),
      Product.find({ stock: { $lte: 10, $gt: 0 } }).limit(5),
      Product.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            value: { $sum: { $multiply: ["$price", "$stock"] } }
          }
        },
        { $sort: { value: -1 } },
        { $limit: 6 }
      ])
    ]);

    const revenueResult = totalRevenue[0] || { total: 0 };

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: revenueResult.total,
        totalUsers,
        recentOrders,
        lowStockProducts,
        categories,
        revenueGrowth: 12.5,
        orderGrowth: 8.3,
        userGrowth: 15.2,
        productGrowth: 5.7
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    
    // Generate sales data based on time range
    // You can implement actual data aggregation based on your needs
    const salesData = generateMockSalesData(range);
    
    res.status(200).json({
      success: true,
      data: salesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales data"
    });
  }
};

export const getCategoryDistribution = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: { $multiply: ["$price", "$stock"] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 6 }
    ]);

    res.status(200).json({
      success: true,
      data: categories.map(cat => ({
        name: cat._id,
        value: cat.value,
        count: cat.count
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category distribution"
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders"
    });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    // Combine recent activities from different models
    const [recentProducts, recentOrders, recentUsers] = await Promise.all([
      Product.find().sort({ updatedAt: -1 }).limit(5),
      Order.find().sort({ updatedAt: -1 }).limit(5),
      User.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const activities = [
      ...recentProducts.map(p => ({
        type: 'product',
        action: p.createdAt === p.updatedAt ? 'added' : 'updated',
        item: p.name,
        time: p.updatedAt
      })),
      ...recentOrders.map(o => ({
        type: 'order',
        action: 'created',
        item: `Order #${o.orderNumber}`,
        time: o.createdAt
      })),
      ...recentUsers.map(u => ({
        type: 'user',
        action: 'registered',
        item: u.name || u.email,
        time: u.createdAt
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time))
     .slice(0, 10);

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities"
    });
  }
};

// Helper function to generate mock sales data
const generateMockSalesData = (range) => {
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