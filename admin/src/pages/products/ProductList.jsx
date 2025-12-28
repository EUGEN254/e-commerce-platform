// src/pages/products/ProductsList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaEye,
  FaDownload,
  FaBox,
  FaStar,
  FaTimes,
  FaCheck,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFire,
  FaChartLine,
  FaSpinner
} from 'react-icons/fa';
import { useProducts } from '../../context/ProductContext';

const ProductsList = () => {
  const { 
    products, 
    loading, 
    fetchProducts, 
    deleteProduct, 
    updateStatus, 
    toggleFeatured, 
    bulkDelete,
    pagination 
  } = useProducts();

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  // Make sure products is always an array
const safeProducts = Array.isArray(products) ? products : [];

// Use safeProducts instead of products everywhere
const categories = ['all', ...new Set(safeProducts.map(p => p?.category).filter(Boolean))];
  
  // Apply filters locally (or you can fetch with filters from API)
  const filteredProducts = safeProducts
    .filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesStatus = 
        selectedStatus === 'all' || product.status === selectedStatus;
      
      const matchesStock = 
        selectedStock === 'all' ||
        (selectedStock === 'inStock' && product.inStock) ||
        (selectedStock === 'outOfStock' && !product.inStock) ||
        (selectedStock === 'lowStock' && product.stock > 0 && product.stock < 10);
      
      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

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

  // Handle product actions
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleToggleFeatured = async (productId) => {
    await toggleFeatured(productId);
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updateStatus(productId, newStatus);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      await bulkDelete(selectedProducts);
      setSelectedProducts([]);
    }
  };

  // Handle bulk featured toggle
  const handleBulkFeaturedToggle = async () => {
    // This would need a bulk update endpoint
    // For now, toggle each individually
    for (const id of selectedProducts) {
      await toggleFeatured(id);
    }
    setSelectedProducts([]);
  };

  // Apply filters to API (optional - you can fetch with filters)
  const applyFilters = useCallback(() => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedCategory !== 'all') filters.category = selectedCategory;
    if (selectedStatus !== 'all') filters.status = selectedStatus;
    if (selectedStock !== 'all') filters.stock = selectedStock;
    if (sortField) filters.sort = `${sortDirection === 'desc' ? '-' : ''}${sortField}`;
    
    fetchProducts(filters);
  }, [searchTerm, selectedCategory, selectedStatus, selectedStock, sortField, sortDirection, fetchProducts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, applyFilters]);

  // Handle sort
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    applyFilters();
  };

  // Get sort icon
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockProducts = products.filter(p => !p.inStock).length;
  const featuredProducts = products.filter(p => p.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Product Management</h2>
            <p className="text-blue-100">Manage your product catalog, inventory, and pricing</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Products</p>
              <p className="text-2xl font-bold">{pagination.total || totalProducts}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Featured</p>
              <p className="text-2xl font-bold">{featuredProducts}</p>
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
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Stock Filter */}
            <div className="relative">
              <FaBox className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Stock</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
                <option value="lowStock">Low Stock</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedProducts.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{selectedProducts.length} selected</span>
                <button 
                  onClick={handleBulkFeaturedToggle}
                  disabled={loading}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors disabled:opacity-50"
                >
                  Toggle Featured
                </button>
                <button 
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  Delete Selected
                </button>
              </div>
            )}
            
            <Link
              to="/products/create"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              <span>Add Product</span>
            </Link>
            
            <button 
              onClick={applyFilters}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaDownload />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">{pagination.total || totalProducts}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaBox className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Inventory Value</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(totalValue)}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaChartLine className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Low Stock</p>
              <h3 className="text-2xl font-bold text-red-600 mt-2">{lowStockProducts}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FaTimes className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Featured Products</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-2">{featuredProducts}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaFire className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : (
          <>
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
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Price</span>
                        {getSortIcon('price')}
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
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Rating</span>
                        {getSortIcon('rating')}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Added</span>
                        {getSortIcon('createdAt')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
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
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={product.mainImage || 'https://via.placeholder.com/150'} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/150';
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 truncate">{product.name}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">{product.brand}</span>
                                {product.isFeatured && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Featured</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getCategoryIcon(product.category)}</span>
                            <div>
                              <p className="font-medium text-gray-800 capitalize">{product.category || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{product.subcategory || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-bold text-gray-800">{formatCurrency(product.price)}</p>
                            {product.discount > 0 && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                  -{product.discount}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            product.stock === 0 
                              ? 'bg-red-100 text-red-800'
                              : product.stock < 10
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400" />
                              <span className="ml-1 font-medium">{product.rating || 0}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">({product.reviewCount || 0})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">{formatDate(product.createdAt)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleStatus(product._id, product.status)}
                              disabled={loading}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full disabled:opacity-50 ${
                                product.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                product.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                            <span className={`text-sm font-medium ${
                              product.status === 'active' ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {product.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleToggleFeatured(product._id)}
                              disabled={loading}
                              className={`p-2 rounded disabled:opacity-50 ${product.isFeatured 
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                              title={product.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                            >
                              <FaFire />
                            </button>
                            
                            <Link
                              to={`/products/${product._id}/edit`}
                              className="p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                              title="Edit Product"
                            >
                              <FaEdit />
                            </Link>
                            
                            <Link
                              to={`/products/${product._id}`}
                              className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
                              title="View Details"
                            >
                              <FaEye />
                            </Link>
                            
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={loading}
                              className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50"
                              title="Delete Product"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <FaBox className="text-4xl text-gray-300" />
                          <p>No products found</p>
                          {searchTerm && (
                            <p className="text-sm">Try adjusting your search or filters</p>
                          )}
                          <Link
                            to="/products/create"
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                          >
                            <FaPlus />
                            <span>Add Your First Product</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {filteredProducts.length} of {pagination.total} products
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => fetchProducts({ page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button 
                    onClick={() => fetchProducts({ page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsList;