import mongoose from "mongoose";
import Transaction from "../../models/Transaction.js";
import Order from "../../models/Order.js";

// Helper function to get date ranges
const getDateRange = (range = "month") => {
  const now = new Date();
  const startDate = new Date();

  switch (range) {
    case "day":
      startDate.setDate(now.getDate() - 1);
      break;
    case "week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(now.getMonth() - 1);
  }

  return { startDate, endDate: now };
};

// Get sales summary
export const getSalesSummary = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { period = "month" } = req.query;
    const { startDate, endDate } = getDateRange(period);

    console.log("=== SALES SUMMARY DEBUG ===");
    console.log("Period:", period);
    console.log("Date range:", startDate, "to", endDate);

    // 1. Get total sales from PAID orders
    const paidOrders = await Order.aggregate([
      {
        $match: {
          status: "PAID",
          paymentStatus: "PAID",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    // 2. Also get from SUCCESS transactions as backup
    const successTransactions = await Transaction.aggregate([
      {
        $match: {
          status: "SUCCESS",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenueFromTransactions: { $sum: "$amountPaid" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    // Use whichever data is available
    let totalSales = 0;
    let totalOrdersCount = 0;
    let averageOrderValue = 0;

    if (paidOrders.length > 0) {
      totalSales = paidOrders[0].totalRevenue || 0;
      totalOrdersCount = paidOrders[0].totalOrders || 0;
      averageOrderValue = paidOrders[0].averageOrderValue || 0;
    } else if (successTransactions.length > 0) {
      totalSales = successTransactions[0].totalRevenueFromTransactions || 0;
      totalOrdersCount = successTransactions[0].totalTransactions || 0;
      averageOrderValue = totalSales / (totalOrdersCount || 1);
    }

    // 3. Get monthly sales data from PAID orders
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: "PAID",
          paymentStatus: "PAID",
          createdAt: {
            $gte: sixMonthsAgo,
            $lte: new Date(),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format monthly data
    const monthlyData = monthlySales.map((item) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString(
        "default",
        { month: "short" },
      ),
      orders: item.orders,
      revenue: item.revenue,
    }));

    // 4. Get top selling products from PAID orders
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: "PAID",
          paymentStatus: "PAID",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          sales: { $sum: "$items.quantity" },
          revenue: {
            $sum: "$items.Subtotal",
          },
          productName: { $first: "$items.name" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
    ]);

    // Format top products
    const topSellingProducts = topProducts.map((item) => ({
      name: item.productName || "Unknown Product",
      sales: item.sales,
      revenue: item.revenue,
      growth: "+0%",
    }));

    const summary = {
      totalSales: totalSales,
      totalOrders: totalOrdersCount,
      totalRevenue: totalSales, // Same as totalSales for now
      averageOrderValue: averageOrderValue,
      monthlyData:
        monthlyData.length > 0 ? monthlyData : getDefaultMonthlyData(),
      period: period,
    };

    res.status(200).json({
      success: true,
      data: summary,
      message: "Sales summary fetched successfully",
    });
  } catch (error) {
    console.error("Get Sales Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales summary",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
