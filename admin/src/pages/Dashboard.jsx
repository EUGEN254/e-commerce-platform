import React, { useEffect } from "react"; // Add useEffect import
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSalesSummary from "../hooks/useSalesSummary";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useProducts } from "../context/ProductContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    categories, 
    fetchProductsCountForCategories, 
    categoriesCountLoading 
  } = useProducts();

  // Add useEffect to fetch product counts on mount
  useEffect(() => {
    fetchProductsCountForCategories();
  }, [fetchProductsCountForCategories]);

  console.log("Categories from context:", categories);
  const { salesSummary, loading } = useSalesSummary();

  if (loading) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading dashboard data..." />
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Sales",
      value: `KES ${salesSummary.totalSales.toLocaleString()}`,
      trend: "+5%",
      trendType: "up",
      icon: ShoppingCart,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: salesSummary.totalOrders.toLocaleString(),
      trend: "-2%",
      trendType: "down",
      icon: Package,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `KES ${salesSummary.totalRevenue.toLocaleString()}`,
      trend: "+10%",
      trendType: "up",
      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const orderData = [
    { month: "Jan", orders: 100, revenue: 80 },
    { month: "Feb", orders: 200, revenue: 160 },
    { month: "Mar", orders: 150, revenue: 120 },
    { month: "Apr", orders: 250, revenue: 200 },
    { month: "May", orders: 300, revenue: 240 },
  ];

  const topProducts = [
    {
      name: "Security Camera",
      sales: 234,
      revenue: "KES 12,300",
      growth: "+12%",
    },
    { name: "Smart Lock", sales: 189, revenue: "KES 9,450", growth: "+8%" },
    { name: "Motion Sensor", sales: 156, revenue: "KES 7,800", growth: "+15%" },
    { name: "Alarm System", sales: 98, revenue: "KES 14,700", growth: "+5%" },
    {
      name: "Doorbell Camera",
      sales: 87,
      revenue: "KES 6,525",
      growth: "+22%",
    },
  ];

  const recentActivity = [
    {
      user: "John Doe",
      action: "placed an order",
      item: "Smart Lock",
      time: "2 min ago",
    },
    {
      user: "Jane Smith",
      action: "submitted a report",
      item: "Noise Complaint",
      time: "15 min ago",
    },
    {
      user: "Mike Johnson",
      action: "installed",
      item: "Security Camera",
      time: "1 hour ago",
    },
    {
      user: "Sarah Wilson",
      action: "renewed subscription",
      item: "Premium Plan",
      time: "2 hours ago",
    },
    {
      user: "Alex Brown",
      action: "created an account",
      item: "New User",
      time: "5 hours ago",
    },
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Calculate total products across all categories
  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat.totalProducts || 0),
    0
  );

  // Get categories with products (handle missing totalProducts)
  const categoriesWithProducts = categories.filter(
    (cat) => (cat.totalProducts || 0) > 0
  );

  // Get top 5 categories by product count
  const topCategories = [...categoriesWithProducts]
    .sort((a, b) => (b.totalProducts || 0) - (a.totalProducts || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      card.trendType === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {card.trendType === "up" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{card.trend}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Order Summary Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Order Summary
                </h2>
                <p className="text-gray-600 text-sm">Orders vs revenue trend</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-0 focus:border-gray-300">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                  <option>All time</option>
                </select>
              </div>
            </div>

            <div className="h-72 focus:outline-none" tabIndex={-1}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={orderData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      padding: "12px",
                      outline: "none",
                    }}
                    wrapperStyle={{ outline: "none" }}
                    formatter={(value, name) => {
                      if (name === "orders")
                        return [`${value} orders`, "Orders"];
                      if (name === "revenue")
                        return [`KES ${value}`, "Revenue"];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      stroke: "#fff",
                      style: { outline: "none" },
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: "#10b981",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#10b981",
                      strokeWidth: 2,
                      stroke: "#fff",
                      style: { outline: "none" },
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Top Selling Products
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Best performers this period
                  </p>
                </div>
                <button
                  onClick={() => navigate("/products")}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left  text-gray-500 text-xs uppercase tr border-b  border-gray-200">
                    <th className="p-2 px-6 font-semibold">Product</th>
                    <th className="p-2 px-6 font-semibold">Sales</th>
                    <th className="p-2 px-6 font-semibold">Revenue</th>
                    <th className="p-2 px-6 font-semibold">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold text-sm">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-700">
                          {product.sales}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-800">
                          {product.revenue}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.growth.startsWith("+")
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.growth}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:w-96 space-y-6">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Recent Activity
                </h2>
                <p className="text-gray-600 text-sm">Latest user activities</p>
              </div>
              <button
                onClick={() => navigate("/notifications")}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                See all
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-gray-800">
                        {activity.user}
                      </span>
                      <span className="text-gray-600"> {activity.action} </span>
                      <span className="font-medium text-blue-600">
                        {activity.item}
                      </span>
                    </p>
                    <div className="flex items-center mt-1">
                      <svg
                        className="w-3 h-3 text-gray-400 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Top Categories
                </h2>
                <p className="text-gray-600 text-sm">
                  Product category distribution
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchProductsCountForCategories}
                  disabled={categoriesCountLoading}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {categoriesCountLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Loading...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </button>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>This month</option>
                  <option>Last month</option>
                  <option>All time</option>
                </select>
              </div>
            </div>

            {categories && categories.length > 0 ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="h-64 w-64 relative">
                    {categoriesCountLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <LoadingSpinner size="md" message="Loading product counts..." />
                      </div>
                    ) : topCategories.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={topCategories.map((cat, index) => ({
                                name: cat.name,
                                value: cat.totalProducts || 0,
                                color:
                                  [
                                    "#3b82f6",
                                    "#10b981",
                                    "#f59e0b",
                                    "#ef4444",
                                    "#8b5cf6",
                                  ][index] || "#3b82f6",
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="value"
                              label={renderCustomizedLabel}
                              labelLine={false}
                            >
                              {topCategories.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    [
                                      "#3b82f6",
                                      "#10b981",
                                      "#f59e0b",
                                      "#ef4444",
                                      "#8b5cf6",
                                    ][index] || "#3b82f6"
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [
                                `${value} products`,
                                "Products",
                              ]}
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>

                        {/* Center text for donut chart */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">
                              {totalProducts}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total Products
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-800 mb-1">
                          No Products Yet
                        </h3>
                        <p className="text-gray-600 text-xs">
                          Add products to see category distribution
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Category Legend */}
                  {topCategories.length > 0 && (
                    <div className="w-full mt-6 space-y-3 max-h-48 overflow-y-auto pr-2">
                      {topCategories.map((category, index) => {
                        const percentage =
                          totalProducts > 0
                            ? Math.round(
                                ((category.totalProducts || 0) / totalProducts) *
                                  100
                              )
                            : 0;

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                          >
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded mr-3"
                                style={{
                                  backgroundColor:
                                    [
                                      "#3b82f6",
                                      "#10b981",
                                      "#f59e0b",
                                      "#ef4444",
                                      "#8b5cf6",
                                    ][index] || "#3b82f6",
                                }}
                              ></div>
                              <div>
                                <span className="text-sm font-medium text-gray-800 block">
                                  {category.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {category.id}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-bold text-gray-800 mr-3">
                                {category.totalProducts || 0}
                              </span>
                              <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor:
                                      [
                                        "#3b82f6",
                                        "#10b981",
                                        "#f59e0b",
                                        "#ef4444",
                                        "#8b5cf6",
                                      ][index] || "#3b82f6",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {categoriesWithProducts.length > 5 && (
                        <div className="text-center pt-2">
                          <span className="text-xs text-gray-500">
                            +{categoriesWithProducts.length - 5} more categories
                            with products
                          </span>
                        </div>
                      )}

                      {categories.length - categoriesWithProducts.length > 0 && (
                        <div className="text-center pt-2">
                          <span className="text-xs text-gray-500">
                            {categories.length - categoriesWithProducts.length}{" "}
                            categories with no products
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary Stats */}
                  {topCategories.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-700">
                            {topCategories[0]?.totalProducts || 0}
                          </div>
                          <div className="text-sm text-blue-600 font-medium truncate">
                            {topCategories[0]?.name || "No products"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Most Products
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-800">
                            {categoriesWithProducts.length}
                          </div>
                          <div className="text-sm text-gray-700 font-medium">
                            Active Categories
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            With Products
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No Categories Found
                </h3>
                <p className="text-gray-600 text-sm max-w-md mb-4">
                  You haven't created any product categories yet.
                </p>
                <button
                  onClick={() => navigate("/categories")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  Create First Category
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;