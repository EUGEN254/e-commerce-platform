// src/pages/categories/CategoriesList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaEye,
  FaDownload,
  FaTags,
  FaStar,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaImage,
  FaList,
  FaInfoCircle,
  FaLayerGroup,
  FaCheck,
  FaTimes,
  FaArrowsAltV,
  FaFolder,
  FaFolderOpen,
  FaTag,
  FaChartBar
} from 'react-icons/fa';

const CategoriesList = () => {
  // Mock data based on your Category model
  const [categories, setCategories] = useState([
    {
      _id: '1',
      id: 'electronics',
      name: 'Electronics',
      icon: '💻',
      path: '/electronics',
      type: 'electronics',
      isMainCategory: true,
      subcategories: ['smartphones', 'laptops', 'tv'],
      subcategoriesDetailed: [
        { name: 'Smartphones', description: 'Mobile phones and accessories', totalProducts: 234 },
        { name: 'Laptops', description: 'Portable computers', totalProducts: 189 },
        { name: 'TVs', description: 'Televisions and displays', totalProducts: 156 }
      ],
      description: 'Latest electronic devices and gadgets',
      totalProducts: 579,
      featured: true,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400',
      bannerImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200',
      order: 1,
      isActive: true,
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z'
    },
    {
      _id: '2',
      id: 'fashion',
      name: 'Fashion',
      icon: '👗',
      path: '/fashion',
      type: 'fashion',
      isMainCategory: true,
      subcategories: ['clothing', 'shoes', 'accessories'],
      subcategoriesDetailed: [
        { name: 'Clothing', description: 'Apparel for all occasions', totalProducts: 456 },
        { name: 'Shoes', description: 'Footwear collection', totalProducts: 312 },
        { name: 'Accessories', description: 'Jewelry, bags, and more', totalProducts: 198 }
      ],
      description: 'Trendy clothing and accessories',
      totalProducts: 966,
      featured: true,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400',
      bannerImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200',
      order: 2,
      isActive: true,
      createdAt: '2024-01-12T14:20:00Z',
      updatedAt: '2024-01-16T09:15:00Z'
    },
    {
      _id: '3',
      id: 'home',
      name: 'Home & Living',
      icon: '🏠',
      path: '/home',
      type: 'home',
      isMainCategory: true,
      subcategories: ['furniture', 'decor', 'kitchen'],
      subcategoriesDetailed: [
        { name: 'Furniture', description: 'Home furniture collection', totalProducts: 178 },
        { name: 'Decor', description: 'Home decoration items', totalProducts: 245 },
        { name: 'Kitchen', description: 'Kitchen appliances and tools', totalProducts: 189 }
      ],
      description: 'Everything for your home',
      totalProducts: 612,
      featured: false,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=400',
      bannerImage: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200',
      order: 3,
      isActive: true,
      createdAt: '2024-01-08T11:45:00Z',
      updatedAt: '2024-01-14T16:30:00Z'
    },
    {
      _id: '4',
      id: 'beauty',
      name: 'Beauty & Health',
      icon: '💄',
      path: '/beauty',
      type: 'beauty',
      isMainCategory: true,
      subcategories: ['skincare', 'makeup', 'haircare'],
      subcategoriesDetailed: [
        { name: 'Skincare', description: 'Face and body care products', totalProducts: 267 },
        { name: 'Makeup', description: 'Cosmetics and beauty tools', totalProducts: 189 },
        { name: 'Haircare', description: 'Hair products and accessories', totalProducts: 156 }
      ],
      description: 'Beauty and wellness products',
      totalProducts: 612,
      featured: true,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400',
      bannerImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200',
      order: 4,
      isActive: true,
      createdAt: '2024-01-05T09:20:00Z',
      updatedAt: '2024-01-13T14:45:00Z'
    },
    {
      _id: '5',
      id: 'sports',
      name: 'Sports & Outdoors',
      icon: '⚽',
      path: '/sports',
      type: 'sports',
      isMainCategory: true,
      subcategories: ['fitness', 'outdoor', 'equipment'],
      subcategoriesDetailed: [
        { name: 'Fitness', description: 'Exercise and gym equipment', totalProducts: 189 },
        { name: 'Outdoor', description: 'Camping and hiking gear', totalProducts: 156 },
        { name: 'Equipment', description: 'Sports equipment', totalProducts: 123 }
      ],
      description: 'Sports gear and outdoor equipment',
      totalProducts: 468,
      featured: false,
      image: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?auto=format&fit=crop&w=400',
      bannerImage: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?auto=format&fit=crop&w=1200',
      order: 5,
      isActive: false,
      createdAt: '2024-01-03T16:30:00Z',
      updatedAt: '2024-01-12T11:20:00Z'
    }
  ]);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState('order');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // Extract unique types from categories
  const types = ['all', ...new Set(categories.map(c => c.type))];
  
  // Filter and sort categories
  const filteredCategories = categories
    .filter(category => {
      const matchesSearch = 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = 
        selectedType === 'all' || category.type === selectedType;
      
      const matchesStatus = 
        selectedStatus === 'all' || 
        (selectedStatus === 'active' && category.isActive) ||
        (selectedStatus === 'inactive' && !category.isActive);
      
      return matchesSearch && matchesType && matchesStatus;
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

  // Handle category selection
  const handleSelectCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map(cat => cat._id));
    }
  };

  // Handle category actions
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleToggleFeatured = (categoryId) => {
    setCategories(prev => prev.map(cat => 
      cat._id === categoryId ? { ...cat, featured: !cat.featured } : cat
    ));
  };

  const handleToggleStatus = (categoryId) => {
    setCategories(prev => prev.map(cat => 
      cat._id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleReorder = (categoryId, direction) => {
    const index = categories.findIndex(c => c._id === categoryId);
    if (index === -1) return;
    
    const newCategories = [...categories];
    const temp = newCategories[index].order;
    
    if (direction === 'up' && index > 0) {
      newCategories[index].order = newCategories[index - 1].order;
      newCategories[index - 1].order = temp;
      // Swap positions
      [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
    } else if (direction === 'down' && index < newCategories.length - 1) {
      newCategories[index].order = newCategories[index + 1].order;
      newCategories[index + 1].order = temp;
      // Swap positions
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
    }
    
    setCategories(newCategories);
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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate statistics
  const totalCategories = categories.length;
  const totalProducts = categories.reduce((sum, cat) => sum + cat.totalProducts, 0);
  const featuredCategories = categories.filter(c => c.featured).length;
  const activeCategories = categories.filter(c => c.isActive).length;

  // Toggle subcategory view
  const toggleSubcategories = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Category Management</h2>
            <p className="text-blue-100">Organize your product categories and subcategories</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Categories</p>
              <p className="text-2xl font-bold">{totalCategories}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Featured</p>
              <p className="text-2xl font-bold">{featuredCategories}</p>
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Type Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Types</option>
                {types.filter(t => t !== 'all').map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <FaTag className="absolute left-3 top-3 text-gray-400" />
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
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedCategories.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{selectedCategories.length} selected</span>
                <button 
                  onClick={() => {
                    // Bulk featured toggle
                    setCategories(prev => prev.map(cat => 
                      selectedCategories.includes(cat._id) 
                        ? { ...cat, featured: !cat.featured }
                        : cat
                    ));
                    setSelectedCategories([]);
                  }}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                >
                  Toggle Featured
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete ${selectedCategories.length} categories?`)) {
                      setCategories(prev => prev.filter(cat => !selectedCategories.includes(cat._id)));
                      setSelectedCategories([]);
                    }
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            )}
            
            <Link
              to="/categories/create"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              <span>Add Category</span>
            </Link>
            
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
              <p className="text-gray-500">Total Categories</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">{totalCategories}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaTags className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Categories</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2">{activeCategories}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheck className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Featured Categories</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-2">{featuredCategories}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaStar className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Products in Categories</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-2">{totalProducts}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaChartBar className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('order')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Order</span>
                    {getSortIcon('order')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    {getSortIcon('type')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('totalProducts')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Products</span>
                    {getSortIcon('totalProducts')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <React.Fragment key={category._id}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleSelectCategory(category._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleReorder(category._id, 'up')}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Move up"
                          >
                            <FaSortUp />
                          </button>
                          <span className="font-medium text-gray-800 w-6 text-center">{category.order}</span>
                          <button
                            onClick={() => handleReorder(category._id, 'down')}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Move down"
                          >
                            <FaSortDown />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {category.image ? (
                              <img 
                                src={category.image} 
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                {category.icon}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="font-bold text-gray-800 truncate">{category.name}</p>
                              {category.featured && (
                                <FaStar className="text-yellow-400 text-sm" />
                              )}
                              {category.isMainCategory && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Main</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">{category.description}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <button
                                onClick={() => toggleSubcategories(category._id)}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                {expandedCategory === category._id ? (
                                  <FaFolderOpen className="text-xs" />
                                ) : (
                                  <FaFolder className="text-xs" />
                                )}
                                <span>{category.subcategories.length} subcategories</span>
                              </button>
                              <span className="text-gray-400">•</span>
                              <span className="text-xs text-gray-500">ID: {category.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <div>
                            <p className="font-medium text-gray-800 capitalize">{category.type}</p>
                            <p className="text-xs text-gray-500">{category.path}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-center">
                          <p className="font-bold text-gray-800 text-lg">{category.totalProducts}</p>
                          <p className="text-xs text-gray-500">products</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">{formatDate(category.createdAt)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleStatus(category._id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              category.isActive ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              category.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                          <span className={`text-sm font-medium ${
                            category.isActive ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleToggleFeatured(category._id)}
                            className={`p-2 rounded ${category.featured 
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title={category.featured ? 'Remove from Featured' : 'Mark as Featured'}
                          >
                            <FaStar />
                          </button>
                          
                          <Link
                            to={`/categories/${category._id}/edit`}
                            className="p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                            title="Edit Category"
                          >
                            <FaEdit />
                          </Link>
                          
                          <Link
                            to={`/categories/${category._id}`}
                            className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>
                          
                          <button 
                            onClick={() => handleDeleteCategory(category._id)}
                            className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
                            title="Delete Category"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Subcategories Row */}
                    {expandedCategory === category._id && category.subcategoriesDetailed && (
                      <tr className="bg-gray-50">
                        <td colSpan="8" className="py-4 px-4">
                          <div className="pl-14">
                            <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                              <FaLayerGroup className="text-gray-400" />
                              <span>Subcategories</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {category.subcategoriesDetailed.map((subcat, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-medium text-gray-800">{subcat.name}</h5>
                                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                      {subcat.totalProducts} products
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{subcat.description}</p>
                                  <div className="flex space-x-2">
                                    <button className="text-xs text-blue-600 hover:text-blue-800">
                                      Edit
                                    </button>
                                    <button className="text-xs text-red-600 hover:text-red-800">
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <button className="text-gray-600 hover:text-blue-600 flex items-center space-x-2">
                                  <FaPlus />
                                  <span>Add Subcategory</span>
                                </button>
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
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FaTags className="text-4xl text-gray-300" />
                      <p>No categories found</p>
                      {searchTerm && (
                        <p className="text-sm">Try adjusting your search or filters</p>
                      )}
                      <Link
                        to="/categories/create"
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                      >
                        <FaPlus />
                        <span>Add Your First Category</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredCategories.length} of {categories.length} categories
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

      {/* Type Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Category Type Distribution</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Analytics →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {types.filter(t => t !== 'all').map(type => {
            const count = categories.filter(c => c.type === type).length;
            const products = categories.filter(c => c.type === type).reduce((sum, cat) => sum + cat.totalProducts, 0);
            const percentage = (count / totalCategories) * 100;
            
            return (
              <div key={type} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">{categories.find(c => c.type === type)?.icon || '📁'}</span>
                </div>
                <p className="font-medium text-gray-800 capitalize">{type}</p>
                <div className="flex justify-center space-x-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Categories</p>
                    <p className="text-xl font-bold text-gray-800">{count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Products</p>
                    <p className="text-xl font-bold text-blue-600">{products}</p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <FaInfoCircle className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Category Management Tips</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Main categories appear in the main navigation menu</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Use the order field to control category display sequence</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Featured categories are highlighted on the homepage</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Inactive categories are hidden from customers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesList;