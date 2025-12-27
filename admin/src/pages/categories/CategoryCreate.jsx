// src/pages/categories/CategoryCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaSortNumericDown
} from 'react-icons/fa';

const CategoryCreate = () => {
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
    isActive: true
  });
  
  // Subcategory form state
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: ''
  });
  
  // Form errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Auto-generate path from name
  const generatePath = (name) => {
    return '/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Auto-generate ID from name
  const generateId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
    
    // Auto-generate path and ID from name
    if (name === 'name') {
      const generatedId = generateId(value);
      const generatedPath = generatePath(value);
      
      setFormData(prev => ({
        ...prev,
        id: generatedId,
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
      subcategories: [...prev.subcategories, subcategoryForm.name.trim().toLowerCase()],
      subcategoriesDetailed: [...prev.subcategoriesDetailed, newSubcategory]
    }));
    
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

  // Remove subcategory
  const handleRemoveSubcategory = (index) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
      subcategoriesDetailed: prev.subcategoriesDetailed.filter((_, i) => i !== index)
    }));
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
    
    setIsSubmitting(true);
    
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
        totalProducts: 0, // Will be calculated later
        featured: formData.featured,
        image: formData.image.trim(),
        bannerImage: formData.bannerImage.trim(),
        order: parseInt(formData.order) || 0,
        isActive: formData.isActive
      };
      
      console.log('Creating category:', categoryData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSuccessMessage(`Category "${formData.name}" created successfully!`);
      
      // Reset form after 2 seconds and redirect
      setTimeout(() => {
        navigate('/categories');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating category:', error);
      setErrors({ submit: 'Failed to create category. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get next available order number
  const getNextOrder = () => {
    // In real app, you would fetch this from the backend
    return 10;
  };

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
              <h2 className="text-2xl font-bold">Add New Category</h2>
            </div>
            <p className="text-blue-100">Create a new product category with subcategories</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <FaTags className="text-3xl opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaCheck className="text-green-600" />
            <div>
              <p className="text-green-800 font-medium">{successMessage}</p>
              <p className="text-green-600 text-sm">Redirecting to categories list...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaTimes className="text-red-600" />
            <p className="text-red-800">{errors.submit}</p>
          </div>
        </div>
      )}

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
              <p className="mt-1 text-xs text-gray-500">
                This will be auto-generated: ID: {formData.id}, Path: {formData.path}
              </p>
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
                Lowercase letters, numbers, and hyphens only
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
              <p className="mt-1 text-xs text-gray-500">
                URL path for this category
              </p>
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
              <p className="mt-1 text-xs text-gray-500">
                Lower numbers appear first
              </p>
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
            <p className="mt-1 text-xs text-gray-500">
              Optional: This appears on category pages
            </p>
          </div>
        </div>

        {/* Subcategories */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaFolder className="text-blue-500" />
            <span>Subcategories</span>
          </h3>
          
          <div className="space-y-6">
            {/* Add Subcategory Form */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-800 mb-4">Add Subcategory</h4>
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
              <div>
                <h4 className="font-medium text-gray-800 mb-4">
                  Subcategories ({formData.subcategoriesDetailed.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.subcategoriesDetailed.map((subcat, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-medium text-gray-800">{subcat.name}</h5>
                          {subcat.description && (
                            <p className="text-sm text-gray-600 mt-1">{subcat.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">ID: {subcat.name.toLowerCase().replace(/\s+/g, '-')}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          0 products
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FaFolderOpen className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No subcategories added yet</p>
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
                Category Image (Optional)
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
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaInfoCircle />
                  <span>Used as thumbnail in category listings</span>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Banner Image (Optional)
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
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaInfoCircle />
                  <span>Used as header banner on category page</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaCheck className="text-blue-500" />
            <span>Category Preview</span>
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-4xl">
                {formData.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="text-xl font-bold text-gray-800">{formData.name || 'Category Name'}</h4>
                  {formData.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center space-x-1">
                      <FaStar className="text-xs" />
                      <span>Featured</span>
                    </span>
                  )}
                  {!formData.isActive && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{formData.description || 'No description provided'}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {formData.type || 'Type'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Order: {formData.order}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    ID: {formData.id || 'category-id'}
                  </span>
                  {formData.isMainCategory && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      Main Category
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {formData.subcategories.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="font-medium text-gray-800 mb-3">Subcategories:</h5>
                <div className="flex flex-wrap gap-2">
                  {formData.subcategories.map((subcat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                    >
                      {subcat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="text-sm text-gray-600">
              <p>Fields marked with * are required</p>
              <p className="mt-1">Auto-generated fields update as you type the category name</p>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Create Category</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <FaInfoCircle className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Category Creation Tips</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Use descriptive names that customers will understand</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Main categories appear in the main navigation menu</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Featured categories are highlighted on the homepage</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Use subcategories to organize products within categories</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Order field determines display sequence (lower numbers first)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;