// src/pages/products/Inventory.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { toast } from "sonner";
import {
  FaBox,
  FaWarehouse,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaShoppingCart,
  FaDollarSign,
  FaTags,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaList,
  FaTable,
  FaRedo,
  FaFileExport,
  FaBell,
  FaExclamation,
} from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency";

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName, 
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
  
       
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaExclamation className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Product
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{productName}"? This action cannot be undone.
                  </p>
                  <p className="text-sm text-red-500 mt-2 font-medium">
                    This product and all its associated data will be permanently removed from inventory.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const { products, loading, fetchProducts, deleteProduct } = useProducts();

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortField, setSortField] = useState("stock");
  const [sortDirection, setSortDirection] = useState("asc");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [restockThreshold, setRestockThreshold] = useState(10);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showOutOfStockOnly, setShowOutOfStockOnly] = useState(false);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = [
      "all",
      ...new Set(products.filter((p) => p?.category).map((p) => p.category)),
    ];
    return cats;
  }, [products]);

  // Calculate inventory statistics
  const inventoryStats = useMemo(() => {
    const stats = {
      totalProducts: products.length,
      totalStock: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      categories: {},
      topProducts: [],
      bottomProducts: [],
    };

    products.forEach((product) => {
      const stock = product.stock || 0;
      const price = product.price || 0;

      stats.totalStock += stock;
      stats.totalValue += stock * price;

      if (stock === 0) {
        stats.outOfStockCount++;
      } else if (stock <= lowStockThreshold) {
        stats.lowStockCount++;
      }

      // Category stats
      const category = product.category || "uncategorized";
      if (!stats.categories[category]) {
        stats.categories[category] = {
          count: 0,
          stock: 0,
          value: 0,
        };
      }
      stats.categories[category].count++;
      stats.categories[category].stock += stock;
      stats.categories[category].value += stock * price;
    });

    // Get top 5 products by stock value
    stats.topProducts = [...products]
      .sort(
        (a, b) =>
          (b.price || 0) * (b.stock || 0) - (a.price || 0) * (a.stock || 0)
      )
      .slice(0, 5);

    // Get bottom 5 products (low stock or out of stock)
    stats.bottomProducts = [...products]
      .filter((p) => p.stock <= restockThreshold)
      .sort((a, b) => (a.stock || 0) - (b.stock || 0))
      .slice(0, 5);

    return stats;
  }, [products, lowStockThreshold, restockThreshold]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      if (!product) return false;

      const matchesSearch =
        searchTerm === "" ||
        (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "inStock" && product.inStock) ||
        (selectedStatus === "outOfStock" && !product.inStock) ||
        (selectedStatus === "lowStock" &&
          product.stock > 0 &&
          product.stock <= lowStockThreshold);

      const matchesLowStockFilter =
        !showLowStockOnly ||
        (product.stock > 0 && product.stock <= lowStockThreshold);
      const matchesOutOfStockFilter =
        !showOutOfStockOnly || product.stock === 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesLowStockFilter &&
        matchesOutOfStockFilter
      );
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField] || 0;
      let bValue = b[sortField] || 0;

      // Special sorting for computed fields
      if (sortField === "value") {
        aValue = (a.price || 0) * (a.stock || 0);
        bValue = (b.price || 0) * (b.stock || 0);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedStatus,
    sortField,
    sortDirection,
    showLowStockOnly,
    showOutOfStockOnly,
    lowStockThreshold,
  ]);

  // Handle product selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((product) => product._id));
    }
  };

  // Handle bulk actions
  const handleBulkRestock = () => {
    const selectedCount = selectedProducts.length;
    toast.info(`Restock request for ${selectedCount} products sent`);
    setSelectedProducts([]);
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`)) {
      toast.info(`Bulk delete request for ${selectedProducts.length} products sent`);
      setSelectedProducts([]);
    }
  };

  const handleBulkDisable = () => {
    const selectedCount = selectedProducts.length;
    toast.info(`${selectedCount} products marked as disabled`);
    setSelectedProducts([]);
  };

  const handleBulkExport = () => {
    toast.success("Inventory report exported successfully");
    setSelectedProducts([]);
  };

  // Handle individual product delete
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete._id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field)
      return <FaSort className="text-gray-400 text-xs" />;
    return sortDirection === "asc" ? (
      <FaSortUp className="text-blue-500" />
    ) : (
      <FaSortDown className="text-blue-500" />
    );
  };


  // Get stock status
  const getStockStatus = (stock) => {
    if (stock === 0)
      return {
        text: "Out of Stock",
        color: "bg-red-100 text-red-800",
        icon: <FaTimesCircle />,
      };
    if (stock <= lowStockThreshold)
      return {
        text: "Low Stock",
        color: "bg-yellow-100 text-yellow-800",
        icon: <FaExclamationTriangle />,
      };
    if (stock <= restockThreshold)
      return {
        text: "Restock Soon",
        color: "bg-orange-100 text-orange-800",
        icon: <FaBell />,
      };
    return {
      text: "In Stock",
      color: "bg-green-100 text-green-800",
      icon: <FaCheckCircle />,
    };
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "shoes":
        return "👟";
      case "electronics":
        return "💻";
      case "clothing":
        return "👕";
      case "mobile":
        return "📱";
      case "accessories":
        return "🕶️";
      case "home":
        return "🏠";
      case "beauty":
        return "💄";
      case "sports":
        return "⚽";
      case "books":
        return "📚";
      case "fashion":
        return "👗";
      default:
        return "📦";
    }
  };

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
              <FaWarehouse className="text-3xl" />
              <h2 className="text-2xl font-bold">Inventory Management</h2>
            </div>
            <p className="text-blue-100">
              Track and manage your product inventory levels
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-wrap items-center gap-4">
            <div className="text-center bg-blue-400/30 rounded-lg p-3 min-w-[120px]">
              <p className="text-sm text-blue-100">Total Value</p>
              <p className="text-2xl font-bold">
                {formatCurrency(inventoryStats.totalValue)}
              </p>
            </div>
            <div className="text-center bg-purple-400/30 rounded-lg p-3 min-w-[120px]">
              <p className="text-sm text-blue-100">Total Stock</p>
              <p className="text-2xl font-bold">
                {inventoryStats.totalStock} units
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {inventoryStats.totalProducts}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaBox className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-2">
                {inventoryStats.lowStockCount}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                ≤ {lowStockThreshold} units
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaExclamationTriangle className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Out of Stock</p>
              <h3 className="text-2xl font-bold text-red-600 mt-2">
                {inventoryStats.outOfStockCount}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FaTimesCircle className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Avg. Stock Value</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-2">
                {formatCurrency(
                  inventoryStats.totalValue /
                    (inventoryStats.totalProducts || 1)
                )}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaChartLine className="text-purple-600 text-2xl" />
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaTags className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none w-full sm:w-48"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((c) => c !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none w-full sm:w-40"
              >
                <option value="all">All Status</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={showLowStockOnly}
                  onChange={(e) => setShowLowStockOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 whitespace-nowrap">Low Stock Only</span>
              </label>
              <label className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={showOutOfStockOnly}
                  onChange={(e) => setShowOutOfStockOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 whitespace-nowrap">Out of Stock Only</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="Table View"
              >
                <FaTable />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="Grid View"
              >
                <FaList />
              </button>
            </div>

            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {selectedProducts.length} selected
                </span>
                <button
                  onClick={handleBulkRestock}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors whitespace-nowrap"
                >
                  Request Restock
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors whitespace-nowrap"
                >
                  Delete Selected
                </button>
              </div>
            )}

            <button
              onClick={handleBulkExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              <FaFileExport />
              <span>Export Report</span>
            </button>

            <button
              onClick={() => fetchProducts()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <FaRedo />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="w-full lg:w-auto">
            <h3 className="font-medium text-gray-800 mb-3 lg:mb-2">
              Stock Threshold Settings
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-gray-600 whitespace-nowrap">Low Stock:</span>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) =>
                    setLowStockThreshold(parseInt(e.target.value) || 5)
                  }
                  min="1"
                  max="100"
                  className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">units</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-gray-600 whitespace-nowrap">Restock Alert:</span>
                <input
                  type="number"
                  value={restockThreshold}
                  onChange={(e) =>
                    setRestockThreshold(parseInt(e.target.value) || 10)
                  }
                  min="1"
                  max="100"
                  className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">units</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            <p className="bg-blue-50 px-3 py-2 rounded-lg">{filteredProducts.length} products found</p>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Inventory Distribution
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {Object.entries(inventoryStats.categories)
              .sort(([,a], [,b]) => b.value - a.value)
              .slice(0, 5)
              .map(([category, stats]) => {
                const percentage =
                  (stats.value / (inventoryStats.totalValue || 1)) * 100;
                return (
                  <div key={category} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-32">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">
                          {getCategoryIcon(category)}
                        </span>
                        <span className="font-medium text-gray-800 capitalize text-sm truncate">
                          {category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {stats.count} products • {formatCurrency(stats.value)}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="truncate">{percentage.toFixed(1)}%</span>
                        <span className="truncate">{formatCurrency(stats.value)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Stock Status Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 truncate">In Stock</p>
                  <p className="text-2xl font-bold text-gray-800 truncate">
                    {inventoryStats.totalProducts -
                      inventoryStats.lowStockCount -
                      inventoryStats.outOfStockCount}
                  </p>
                </div>
                <FaCheckCircle className="text-2xl text-green-500 flex-shrink-0" />
              </div>
              <div className="mt-2 h-1 bg-green-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${
                      ((inventoryStats.totalProducts -
                        inventoryStats.lowStockCount -
                        inventoryStats.outOfStockCount) /
                        (inventoryStats.totalProducts || 1)) *
                        100 || 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 truncate">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-800 truncate">
                    {inventoryStats.lowStockCount}
                  </p>
                </div>
                <FaExclamationTriangle className="text-2xl text-yellow-500 flex-shrink-0" />
              </div>
              <div className="mt-2 h-1 bg-yellow-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{
                    width: `${
                      (inventoryStats.lowStockCount /
                        (inventoryStats.totalProducts || 1)) *
                        100 || 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 truncate">Out of Stock</p>
                  <p className="text-2xl font-bold text-gray-800 truncate">
                    {inventoryStats.outOfStockCount}
                  </p>
                </div>
                <FaTimesCircle className="text-2xl text-red-500 flex-shrink-0" />
              </div>
              <div className="mt-2 h-1 bg-red-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${
                      (inventoryStats.outOfStockCount /
                        (inventoryStats.totalProducts || 1)) *
                        100 || 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 truncate">High Value</p>
                  <p className="text-2xl font-bold text-gray-800 truncate">
                    {inventoryStats.topProducts.length}
                  </p>
                </div>
                <FaChartLine className="text-2xl text-purple-500 flex-shrink-0" />
              </div>
              <div className="mt-2 h-1 bg-purple-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${
                      (inventoryStats.topProducts.length /
                        (inventoryStats.totalProducts || 1)) *
                        100 || 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table/Grid */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left w-12">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                        disabled={filteredProducts.length === 0}
                      />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer min-w-[200px]"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Product</span>
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer min-w-[120px]"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      {getSortIcon("category")}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer min-w-[100px]"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Stock</span>
                      {getSortIcon("stock")}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer min-w-[140px]"
                    onClick={() => handleSort("value")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Inventory Value</span>
                      {getSortIcon("value")}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium min-w-[120px]">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium min-w-[180px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock || 0);
                    const inventoryValue =
                      (product.price || 0) * (product.stock || 0);

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => handleSelectProduct(product._id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={product.mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/150";
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-800 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {product.brand}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                SKU: {product._id?.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg flex-shrink-0">
                              {getCategoryIcon(product.category)}
                            </span>
                            <span className="text-sm text-gray-700 capitalize truncate">
                              {product.category}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1 min-w-0">
                            <p className="font-bold text-gray-800 truncate">
                              {product.stock || 0} units
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              Price: {formatCurrency(product.price)}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1 min-w-0">
                            <p className="font-bold text-blue-600 truncate">
                              {formatCurrency(inventoryValue)}
                            </p>
                            <div className="flex items-center">
                              {product.stock > 0 && (
                                <span className="text-xs text-gray-500 truncate">
                                  {formatCurrency(product.price || 0)} ×{" "}
                                  {product.stock}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color} whitespace-nowrap`}
                          >
                            {stockStatus.icon}
                            <span>{stockStatus.text}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/products/${product._id}`}
                              className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200 transition-colors flex-shrink-0"
                              title="View Details"
                            >
                              <FaEye />
                            </Link>
                            <Link
                              to={`/products/${product._id}/edit`}
                              className="p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors flex-shrink-0"
                              title="Edit Product"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => {
                                toast.info(
                                  `Restock request sent for ${product.name}`
                                );
                              }}
                              className="p-2 rounded bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors flex-shrink-0"
                              title="Request Restock"
                            >
                              <FaShoppingCart />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex-shrink-0"
                              title="Delete Product"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <FaBox className="text-5xl text-gray-300" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-600">No products found</p>
                          <p className="text-gray-500 max-w-md">
                            No products match your current filters. Try adjusting your search or filter criteria.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedCategory("all");
                            setSelectedStatus("all");
                            setShowLowStockOnly(false);
                            setShowOutOfStockOnly(false);
                          }}
                          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock || 0);
              const inventoryValue = (product.price || 0) * (product.stock || 0);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{product.brand}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="rounded border-gray-300 flex-shrink-0 ml-2"
                      />
                    </div>

                    <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300";
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="text-xl flex-shrink-0">
                            {getCategoryIcon(product.category)}
                          </span>
                          <span className="text-sm text-gray-700 capitalize truncate">
                            {product.category}
                          </span>
                        </div>
                        <div
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} whitespace-nowrap flex-shrink-0`}
                        >
                          {stockStatus.icon}
                          <span>{stockStatus.text}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-gray-600">Stock</p>
                          <p className="font-bold text-gray-800 truncate">
                            {product.stock || 0} units
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Price</p>
                          <p className="font-bold text-gray-800 truncate">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Value</p>
                          <p className="font-bold text-blue-600 truncate">
                            {formatCurrency(inventoryValue)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <Link
                          to={`/products/${product._id}`}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
                        >
                          View
                        </Link>
                        <Link
                          to={`/products/${product._id}/edit`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm whitespace-nowrap"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <FaBox className="text-5xl text-gray-300" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-600">No products found</p>
                  <p className="text-gray-500 max-w-md">
                    No products match your current filters. Try adjusting your search or filter criteria.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                    setShowLowStockOnly(false);
                    setShowOutOfStockOnly(false);
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Restock Alerts */}
      {inventoryStats.bottomProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Restock Alerts
            </h3>
            <span className="text-sm text-gray-500 bg-yellow-50 px-3 py-1 rounded-full">
              Products with stock ≤ {restockThreshold} units
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryStats.bottomProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-red-600 font-medium truncate">
                      {product.stock} units left
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    toast.info(`Restock order created for ${product.name}`);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap flex-shrink-0 ml-3"
                >
                  Restock Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Inventory;