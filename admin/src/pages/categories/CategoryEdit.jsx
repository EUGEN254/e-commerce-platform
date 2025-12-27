// src/pages/categories/CategoryEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaTags, 
  FaArrowLeft, 
  FaImage, 
  FaTag,
  FaLayerGroup,
  FaList,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaUpload,
  FaTrash,
  FaStar,
  FaSave,
  FaPlus,
  FaMinus,
  FaFolder,
  FaFolderOpen,
  FaSortNumericDown,
  FaHistory,
  FaEye,
  FaChartBar,
  FaShoppingCart,
  FaEdit
} from 'react-icons/fa';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Available types from your model
  const types = [
    { value: 'main', label: 'Main', icon: '🏠' },
    { value: 'fashion', label: 'Fashion', icon: '👗' },
    { value: 'electronics', label: 'Electronics', icon: '💻' },
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'beauty', label: 'Beauty', icon: '💄' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'books', label: 'Books', icon: '📚' }
  ];

  // Common icons for categories
  const categoryIcons = [
    { value: '💻', label: 'Laptop' },
    { value: '📱', label: 'Mobile' },
    { value: '👗', label: 'Dress' },
    { value: '👟', label: 'Shoes' },
    { value: '👜', label: 'Bag' },
    { value: '⌚', label: 'Watch' },
    { value: '🏠', label: 'Home' },
    { value: '🍽️', label: 'Kitchen' },
    { value: '🛏️', label: 'Bed' },
    { value: '💄', label: 'Makeup' },
    { value: '🧴', label: 'Lotion' },
    { value: '⚽', label: 'Sports' },
    { value: '🏃', label: 'Running' },
    { value: '📚', label: 'Book' },
    { value: '✏️', label: 'Stationery' },
    { value: '🎮', label: 'Gaming' },
    { value: '🎧', label: 'Headphones' },
    { value: '📺', label: 'TV' },
    { value: '🚗', label: 'Car' },
    { value: '✈️', label: 'Travel' }
  ];

  // Category state
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    id: '',
    name: '',
    icon: '📦',
    path: '',
    type: 'main',
    
    // Details
    description: '',
    isMainCategory: false,
    
    // Subcategories
    subcategories: [],
    subcategoriesDetailed: [],
    
    // Images
    image: '',
    bannerImage: '',
    
    // Settings
    order: 0,
    featured: false,
    isActive: true,
    
    // Readonly
    totalProducts: 0
  });
  
  // Subcategory form state
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: ''
  });
  
  // Activity logs
  const [activityLogs, setActivityLogs] = useState([]);
  
  // Form errors
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load category data
  useEffect(() => {
    loadCategoryData();
    loadActivityLogs();
  }, [id]);

  // Mock API call to load category data
  const loadCategoryData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock category data based on your model
      const mockCategory = {
        _id: id,
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
        description: 'Latest electronic devices and gadgets for modern living',
        totalProducts: 579,
        featured: true,
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400',
        bannerImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200',
        order: 1,
        isActive: true,
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: '2024-01-15T14:20:00Z'
      };
      
      setCategory(mockCategory);
      
      // Set form data
      setFormData({
        id: mockCategory.id,
        name: mockCategory.name,
        icon: mockCategory.icon,
        path: mockCategory.path,
        type: mockCategory.type,
        description: mockCategory.description,
        isMainCategory: mockCategory.isMainCategory,
        subcategories: mockCategory.subcategories,
        subcategoriesDetailed: mockCategory.subcategoriesDetailed,
        image: mockCategory.image,
        bannerImage: mockCategory.bannerImage,
        order: mockCategory.order,
        featured: mockCategory.featured,
        isActive: mockCategory.isActive,
        totalProducts: mockCategory.totalProducts
      });
      
    } catch (error) {
      console.error('Error loading category:', error);
      setErrors({ load: 'Failed to load category data' });
    } finally {
      setIsLoading(false);
    }
  };

  // Load activity logs
  const loadActivityLogs = async () => {
    // Mock activity logs
    const mockLogs = [
      { id: 1, action: 'Category Created', timestamp: '2024-01-10T10:30:00Z', details: 'Added to catalog' },
      { id: 2, action: 'Subcategory Added', timestamp: '2024-01-12T14:20:00Z', details: 'Added "Smartphones" subcategory' },
      { id: 3, action: 'Featured Status', timestamp: '2024-01-13T09:45:00Z', details: 'Marked as featured category' },
      { id: 4, action: 'Products Added', timestamp: '2024-01-14T11:30:00Z', details: '45 new products added' },
      { id: 5, action: 'Image Updated', timestamp: '2024-01-15T08:30:00Z', details: 'Updated category image' },
    ];
    
    setActivityLogs(mockLogs);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Auto-generate path from name
    if (name === 'name' && value) {
      const generatedPath = '/' + value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        path: generatedPath
      }));
    }
    
    // Update path if ID changes
    if (name === 'id' && value) {
      setFormData(prev => ({
        ...prev,
        path: '/' + value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }));
    }
  };

  // Handle subcategory input changes
  const handleSubcategoryChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add subcategory
  const handleAddSubcategory = () => {
    if (!subcategoryForm.name.trim()) {
      setErrors(prev => ({ ...prev, subcategoryName: 'Subcategory name is required' }));
      return;
    }
    
    const newSubcategory = {
      name: subcategoryForm.name.trim(),
      description: subcategoryForm.description.trim(),
      totalProducts: 0
    };
    
    setFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, subcategoryForm.name.trim().toLowerCase().replace(/\s+/g, '-')],
      subcategoriesDetailed: [...prev.subcategoriesDetailed, newSubcategory]
    }));
    
    // Add activity log
    const newLog = {
      id: activityLogs.length + 1,
      action: 'Subcategory Added',
      timestamp: new Date().toISOString(),
      details: `Added "${subcategoryForm.name.trim()}" subcategory`
    };
    
    setActivityLogs(prev => [newLog, ...prev]);
    
    // Clear form
    setSubcategoryForm({
      name: '',
      description: ''
    });
    
    // Clear error
    if (errors.subcategoryName) {
      setErrors(prev => ({ ...prev, subcategoryName: '' }));
    }
  };

  // Edit subcategory
  const handleEditSubcategory = (index, field, value) => {
    const updatedSubcategories = [...formData.subcategoriesDetailed];
    updatedSubcategories[index][field] = value;
    
    // Update simple subcategories array
    const updatedSimpleSubcategories = updatedSubcategories.map(sc => 
      sc.name.toLowerCase().replace(/\s+/g, '-')
    );
    
    setFormData(prev => ({
      ...prev,
      subcategories: updatedSimpleSubcategories,
      subcategoriesDetailed: updatedSubcategories
    }));
  };

  // Remove subcategory
  const handleRemoveSubcategory = (index) => {
    const subcategoryName = formData.subcategoriesDetailed[index].name;
    
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
      subcategoriesDetailed: prev.subcategoriesDetailed.filter((_, i) => i !== index)
    }));
    
    // Add activity log
    const newLog = {
      id: activityLogs.length + 1,
      action: 'Subcategory Removed',
      timestamp: new Date().toISOString(),
      details: `Removed "${subcategoryName}" subcategory`
    };
    
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id.trim()) newErrors.id = 'Category ID is required';
    else if (!/^[a-z0-9-]+$/.test(formData.id)) newErrors.id = 'ID can only contain lowercase letters, numbers, and hyphens';
    
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.icon.trim()) newErrors.icon = 'Icon is required';
    if (!formData.path.trim()) newErrors.path = 'Path is required';
    if (!formData.type) newErrors.type = 'Type is required';
    
    // Validate URLs if provided
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    
    if (formData.bannerImage && !isValidUrl(formData.bannerImage)) {
      newErrors.bannerImage = 'Please enter a valid banner image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare category data based on your model
      const categoryData = {
        id: formData.id.toLowerCase().trim(),
        name: formData.name.trim(),
        icon: formData.icon,
        path: formData.path.trim(),
        type: formData.type,
        isMainCategory: formData.isMainCategory,
        subcategories: formData.subcategories,
        subcategoriesDetailed: formData.subcategoriesDetailed,
        description: formData.description.trim(),
        totalProducts: formData.totalProducts,
        featured: formData.featured,
        image: formData.image.trim(),
        bannerImage: formData.bannerImage.trim(),
        order: parseInt(formData.order) || 0,
        isActive: formData.isActive,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Updating category:', categoryData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update category state
      setCategory(prev => ({
        ...prev,
        ...categoryData,
        _id: id
      }));
      
      // Add activity log
      const newLog = {
        id: activityLogs.length + 1,
        action: 'Category Updated',
        timestamp: new Date().toISOString(),
        details: 'Category information was updated'
      };
      
      setActivityLogs(prev => [newLog, ...prev]);
      
      // Show success message
      setSuccessMessage('Category updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error updating category:', error);
      setErrors({ submit: 'Failed to update category. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!window.confirm('Are you sure you want to delete this category? All subcategories and products will be affected.')) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Deleting category:', id);
      navigate('/categories');
      
    } catch (error) {
      console.error('Error deleting category:', error);
      setErrors({ submit: 'Failed to delete category.' });
      setIsSaving(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category data...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/categories')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Categories
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
                onClick={() => navigate('/categories')}
                className="p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-2xl font-bold">Edit Category</h2>
            </div>
            <p className="text-blue-100">Update category details and settings</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm text-blue-100">Category ID</p>
                <p className="font-mono text-sm">{category.id}</p>
              </div>
              <FaTags className="text-3xl opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Success & Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaCheck className="text-green-600" />
            <div>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaTimes className="text-red-600" />
            <p className="text-red-800">{errors.submit}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Category Info & Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-6xl">
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{category.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <FaShoppingCart className="text-gray-400" />
                    <span className="font-medium text-gray-600">{category.totalProducts} products</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </div>
                  {category.featured && (
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <FaStar />
                      <span>Featured</span>
                    </div>
                  )}
                  {category.isMainCategory && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Main Category
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize">{category.type}</span>
                  </div>
                  <span>•</span>
                  <span>Path: {category.path}</span>
                  <span>•</span>
                  <span>Last Updated: {formatDate(category.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <FaTags className="text-blue-500" />
                <span>Basic Information</span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Electronics, Fashion, etc."
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category ID *
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.id ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="electronics, fashion, etc."
                  />
                  {errors.id && (
                    <p className="mt-1 text-sm text-red-600">{errors.id}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Path: {formData.path}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon *
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center text-3xl">
                      {formData.icon}
                    </div>
                    <div className="flex-1">
                      <select
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.icon ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select an icon</option>
                        {categoryIcons.map(icon => (
                          <option key={icon.value} value={icon.value}>
                            {icon.value} {icon.label}
                          </option>
                        ))}
                      </select>
                      {errors.icon && (
                        <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Path *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">/</span>
                    <input
                      type="text"
                      name="path"
                      value={formData.path.replace(/^\//, '')}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.path ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="category-path"
                    />
                  </div>
                  {errors.path && (
                    <p className="mt-1 text-sm text-red-600">{errors.path}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Category Type & Settings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <FaLayerGroup className="text-blue-500" />
                <span>Category Type & Settings</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.type ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Type</option>
                    {types.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <div className="relative">
                    <FaSortNumericDown className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      min="0"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Display order"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isMainCategory"
                      name="isMainCategory"
                      checked={formData.isMainCategory}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isMainCategory" className="font-medium text-gray-800">
                      Main Category
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="font-medium text-gray-800 flex items-center space-x-2">
                      <FaStar className="text-yellow-500" />
                      <span>Featured Category</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="font-medium text-gray-800">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <FaList className="text-blue-500" />
                <span>Description</span>
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe this category..."
                />
              </div>
            </div>

            {/* Subcategories */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <FaFolder className="text-blue-500" />
                <span>Subcategories ({formData.subcategoriesDetailed.length})</span>
              </h3>
              
              <div className="space-y-6">
                {/* Add Subcategory Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-800 mb-4">Add New Subcategory</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={subcategoryForm.name}
                        onChange={handleSubcategoryChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.subcategoryName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Smartphones, Laptops"
                      />
                      {errors.subcategoryName && (
                        <p className="mt-1 text-sm text-red-600">{errors.subcategoryName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={subcategoryForm.description}
                        onChange={handleSubcategoryChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleAddSubcategory}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <FaPlus />
                      <span>Add Subcategory</span>
                    </button>
                  </div>
                </div>
                
                {/* Subcategories List */}
                {formData.subcategoriesDetailed.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Current Subcategories</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.subcategoriesDetailed.map((subcat, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={subcat.name}
                                onChange={(e) => handleEditSubcategory(index, 'name', e.target.value)}
                                className="w-full font-medium text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={subcat.description}
                                onChange={(e) => handleEditSubcategory(index, 'description', e.target.value)}
                                className="w-full text-sm text-gray-600 mt-1 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                                placeholder="Add description..."
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubcategory(index)}
                              className="text-gray-500 hover:text-red-500 ml-2"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              ID: {subcat.name.toLowerCase().replace(/\s+/g, '-')}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {subcat.totalProducts} products
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <FaFolderOpen className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No subcategories</p>
                    <p className="text-sm text-gray-400 mt-1">Add subcategories to organize products further</p>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <FaImage className="text-blue-500" />
                <span>Category Images</span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Category Image
                  </label>
                  <div className="space-y-4">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.image ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/category-image.jpg"
                    />
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                    )}
                    
                    {formData.image && (
                      <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden border">
                        <img 
                          src={formData.image} 
                          alt="Category preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200?text=Invalid+URL';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Banner Image
                  </label>
                  <div className="space-y-4">
                    <input
                      type="url"
                      name="bannerImage"
                      value={formData.bannerImage}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.bannerImage ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/banner-image.jpg"
                    />
                    {errors.bannerImage && (
                      <p className="mt-1 text-sm text-red-600">{errors.bannerImage}</p>
                    )}
                    
                    {formData.bannerImage && (
                      <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                        <img 
                          src={formData.bannerImage} 
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/600x200?text=Invalid+URL';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/categories')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column - Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FaTags className="text-blue-500" />
              <span>Quick Actions</span>
            </h4>
            
            <div className="space-y-3">
              <button
                onClick={() => window.open(`/categories/${category.id}`, '_blank')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">View Category</p>
                    <p className="text-sm text-gray-600">Open in storefront</p>
                  </div>
                  <FaEye className="text-gray-400" />
                </div>
              </button>

              <button
                onClick={handleDeleteCategory}
                disabled={isSaving}
                className="w-full text-left p-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-700">Delete Category</p>
                    <p className="text-sm text-red-600">Permanently remove</p>
                  </div>
                  <FaTrash className="text-red-500" />
                </div>
              </button>
            </div>
          </div>

          {/* Category Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Category Statistics</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{formData.totalProducts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subcategories</p>
                <p className="text-2xl font-bold text-blue-600">{formData.subcategories.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(category.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(category.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Subcategory Stats */}
          {formData.subcategoriesDetailed.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Subcategory Products</h4>
              <div className="space-y-3">
                {formData.subcategoriesDetailed.map((subcat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 truncate">{subcat.name}</span>
                    <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {subcat.totalProducts}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FaHistory className="text-blue-500" />
              <span>Recent Activity</span>
            </h4>
            
            <div className="space-y-4">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                      <span>{formatDate(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Editing Tips</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Changing ID will affect product URLs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Main categories appear in navigation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Inactive categories are hidden</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEdit;