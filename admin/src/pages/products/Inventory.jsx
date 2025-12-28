// src/pages/products/Inventory.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { toast } from 'sonner';
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
  FaBell
} from 'react-icons/fa';

const Inventory = () => {
  const { products, loading, fetchProducts, deleteProduct } = useProducts();
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState('stock');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [restockThreshold, setRestockThreshold] = useState(10);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showOutOfStockOnly, setShowOutOfStockOnly] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products
      .filter(p => p?.category)
      .map(p => p.category)
    )];
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
      bottomProducts: []
    };

    products.forEach(product => {
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
      const category = product.category || 'uncategorized';
      if (!stats.categories[category]) {
        stats.categories[category] = {
          count: 0,
          stock: 0,
          value: 0
        };
      }
      stats.categories[category].count++;
      stats.categories[category].stock += stock;
      stats.categories[category].value += stock * price;
    });

    // Get top 5 products by stock value
    stats.topProducts = [...products]
      .sort((a, b) => (b.price || 0) * (b.stock || 0) - (a.price || 0) * (a.stock || 0))
      .slice(0, 5);

    // Get bottom 5 products (low stock or out of stock)
    stats.bottomProducts = [...products]
      .filter(p => p.stock <= restockThreshold)
      .sort((a, b) => (a.stock || 0) - (b.stock || 0))
      .slice(0, 5);

    return stats;
  }, [products, lowStockThreshold, restockThreshold]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (!product) return false;
      
      const matchesSearch = searchTerm === '' || 
        (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesStatus = 
        selectedStatus === 'all' || 
        (selectedStatus === 'inStock' && product.inStock) ||
        (selectedStatus === 'outOfStock' && !product.inStock) ||
        (selectedStatus === 'lowStock' && product.stock > 0 && product.stock <= lowStockThreshold);
      
      const matchesLowStockFilter = !showLowStockOnly || (product.stock > 0 && product.stock <= lowStockThreshold);
      const matchesOutOfStockFilter = !showOutOfStockOnly || product.stock === 0;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesLowStockFilter && matchesOutOfStockFilter;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField] || 0;
      let bValue = b[sortField] || 0;
      
      // Special sorting for computed fields
      if (sortField === 'value') {
        aValue = (a.price || 0) * (a.stock || 0);
        bValue = (b.price || 0) * (b.stock || 0);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedStatus, sortField, sortDirection, showLowStockOnly, showOutOfStockOnly, lowStockThreshold]);

  // Handle product selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product._id));
    }
  };

  // Handle bulk actions
  const handleBulkRestock = () => {
    const selectedCount = selectedProducts.length;
    toast.info(`Restock request for ${selectedCount} products sent`);
    setSelectedProducts([]);
  };

  const handleBulkDisable = () => {
    const selectedCount = selectedProducts.length;
    toast.info(`${selectedCount} products marked as disabled`);
    setSelectedProducts([]);
  };

  const handleBulkExport = () => {
    toast.success('Inventory report exported successfully');
    setSelectedProducts([]);
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

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400 text-xs" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="text-blue-500" /> 
      : <FaSortDown className="text-blue-500" />;
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle /> };
    if (stock <= lowStockThreshold) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationTriangle /> };
    if (stock <= restockThreshold) return { text: 'Restock Soon', color: 'bg-orange-100 text-orange-800', icon: <FaBell /> };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle /> };
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
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
            <p className="text-blue-100">Track and manage your product inventory levels</p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(inventoryStats.totalValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Stock</p>
              <p className="text-2xl font-bold">{inventoryStats.totalStock} units</p>
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
              <h3 className="text-2xl font-bold text-gray-800 mt-2">{inventoryStats.totalProducts}</h3>
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
              <h3 className="text-2xl font-bold text-yellow-600 mt-2">{inventoryStats.lowStockCount}</h3>
              <p className="text-sm text-gray-500 mt-1">≤ {lowStockThreshold} units</p>
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
              <h3 className="text-2xl font-bold text-red-600 mt-2">{inventoryStats.outOfStockCount}</h3>
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
                {formatCurrency(inventoryStats.totalValue / (inventoryStats.totalProducts || 1))}
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <FaTags className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map(category => (
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
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
            
            {/* Quick Filters */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showLowStockOnly}
                  onChange={(e) => setShowLowStockOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Low Stock Only</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showOutOfStockOnly}
                  onChange={(e) => setShowOutOfStockOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Out of Stock Only</span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                title="Table View"
              >
                <FaTable />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                title="Grid View"
              >
                <FaList />
              </button>
            </div>
            
            {selectedProducts.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{selectedProducts.length} selected</span>
                <button 
                  onClick={handleBulkRestock}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Request Restock
                </button>
                <button 
                  onClick={handleBulkDisable}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Disable
                </button>
              </div>
            )}
            
            <button 
              onClick={handleBulkExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaFileExport />
              <span>Export Report</span>
            </button>
            
            <button 
              onClick={() => fetchProducts()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Stock Threshold Settings</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Low Stock:</span>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 5)}
                  min="1"
                  max="100"
                  className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">units</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Restock Alert:</span>
                <input
                  type="number"
                  value={restockThreshold}
                  onChange={(e) => setRestockThreshold(parseInt(e.target.value) || 10)}
                  min="1"
                  max="100"
                  className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">units</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>{filteredProducts.length} products found</p>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      {/* Category Distribution */}
{/* Category Distribution - Alternative Chart View */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-6">Inventory Distribution</h3>
    <div className="space-y-4">
      {Object.entries(inventoryStats.categories).slice(0, 5).map(([category, stats]) => {
        const percentage = (stats.value / (inventoryStats.totalValue || 1)) * 100;
        return (
          <div key={category} className="flex items-center space-x-4">
            <div className="w-32">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getCategoryIcon(category)}</span>
                <span className="font-medium text-gray-800 capitalize text-sm truncate">
                  {category}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.count} products • {formatCurrency(stats.value)}
              </p>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{percentage.toFixed(1)}%</span>
                <span>{formatCurrency(stats.value)}</span>
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
    <h3 className="text-lg font-semibold text-gray-800 mb-6">Stock Status Overview</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">In Stock</p>
            <p className="text-2xl font-bold text-gray-800">
              {inventoryStats.totalProducts - inventoryStats.lowStockCount - inventoryStats.outOfStockCount}
            </p>
          </div>
          <FaCheckCircle className="text-2xl text-green-500" />
        </div>
        <div className="mt-2 h-1 bg-green-200 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full"
            style={{ 
              width: `${((inventoryStats.totalProducts - inventoryStats.lowStockCount - inventoryStats.outOfStockCount) / inventoryStats.totalProducts * 100) || 0}%` 
            }}
          />
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-gray-800">{inventoryStats.lowStockCount}</p>
          </div>
          <FaExclamationTriangle className="text-2xl text-yellow-500" />
        </div>
        <div className="mt-2 h-1 bg-yellow-200 rounded-full">
          <div 
            className="h-full bg-yellow-500 rounded-full"
            style={{ 
              width: `${(inventoryStats.lowStockCount / inventoryStats.totalProducts * 100) || 0}%` 
            }}
          />
        </div>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-800">{inventoryStats.outOfStockCount}</p>
          </div>
          <FaTimesCircle className="text-2xl text-red-500" />
        </div>
        <div className="mt-2 h-1 bg-red-200 rounded-full">
          <div 
            className="h-full bg-red-500 rounded-full"
            style={{ 
              width: `${(inventoryStats.outOfStockCount / inventoryStats.totalProducts * 100) || 0}%` 
            }}
          />
        </div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">High Value</p>
            <p className="text-2xl font-bold text-gray-800">{inventoryStats.topProducts.length}</p>
          </div>
          <FaChartLine className="text-2xl text-purple-500" />
        </div>
        <div className="mt-2 h-1 bg-purple-200 rounded-full">
          <div 
            className="h-full bg-purple-500 rounded-full"
            style={{ 
              width: `${(inventoryStats.topProducts.length / inventoryStats.totalProducts * 100) || 0}%` 
            }}
          />
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Products Table/Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                        disabled={filteredProducts.length === 0}
                      />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Product</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      {getSortIcon('category')}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Stock</span>
                      {getSortIcon('stock')}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                    onClick={() => handleSort('value')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Inventory Value</span>
                      {getSortIcon('value')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock || 0);
                    const inventoryValue = (product.price || 0) * (product.stock || 0);
                    
                    return (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => handleSelectProduct(product._id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={product.mainImage} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/150';
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.brand}</p>
                              <p className="text-xs text-gray-400">SKU: {product._id?.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getCategoryIcon(product.category)}</span>
                            <span className="text-sm text-gray-700 capitalize">{product.category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <p className="font-bold text-gray-800">{product.stock || 0} units</p>
                            <p className="text-xs text-gray-500">
                              Price: {formatCurrency(product.price)}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <p className="font-bold text-blue-600">{formatCurrency(inventoryValue)}</p>
                            <div className="flex items-center">
                              {product.stock > 0 && (
                                <span className="text-xs text-gray-500">
                                  {formatCurrency(product.price || 0)} × {product.stock}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                            {stockStatus.icon}
                            <span>{stockStatus.text}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/products/${product._id}`}
                              className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
                              title="View Details"
                            >
                              <FaEye />
                            </Link>
                            <Link
                              to={`/products/${product._id}/edit`}
                              className="p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                              title="Edit Product"
                            >
                              <FaEdit />
                            </Link>
                            <button 
                              onClick={() => {
                                // Handle restock action
                                toast.info(`Restock request sent for ${product.name}`);
                              }}
                              className="p-2 rounded bg-orange-100 text-orange-600 hover:bg-orange-200"
                              title="Request Restock"
                            >
                              <FaShoppingCart />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FaBox className="text-4xl text-gray-300" />
                        <p>No products found matching your filters</p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('all');
                            setSelectedStatus('all');
                            setShowLowStockOnly(false);
                            setShowOutOfStockOnly(false);
                          }}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Clear Filters
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock || 0);
            const inventoryValue = (product.price || 0) * (product.stock || 0);
            
            return (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={product.mainImage} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300';
                      }}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getCategoryIcon(product.category)}</span>
                        <span className="text-sm text-gray-700 capitalize">{product.category}</span>
                      </div>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.icon}
                        <span>{stockStatus.text}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Stock</p>
                        <p className="font-bold text-gray-800">{product.stock || 0} units</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-bold text-gray-800">{formatCurrency(product.price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Value</p>
                        <p className="font-bold text-blue-600">{formatCurrency(inventoryValue)}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <Link
                        to={`/products/${product._id}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/products/${product._id}/edit`}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => {
                          toast.info(`Restock request sent for ${product.name}`);
                        }}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Restock Alerts */}
      {inventoryStats.bottomProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Restock Alerts</h3>
            <span className="text-sm text-gray-500">Products with stock ≤ {restockThreshold} units</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryStats.bottomProducts.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={product.mainImage} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-sm text-red-600 font-medium">{product.stock} units left</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    toast.info(`Restock order created for ${product.name}`);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Restock Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;