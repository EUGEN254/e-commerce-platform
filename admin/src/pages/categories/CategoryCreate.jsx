// src/pages/categories/CategoryCreate.jsx - CLEAN VERSION
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
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
  FaCamera,
  FaCloudUploadAlt,
  FaSearch,
  FaBox,
  FaPalette,
  FaRuler
} from 'react-icons/fa';
import * as categoryIconService from '../../services/icons';
import categoryService from '../../services/categoryService';
import { getProductTypeConfigs } from '../../utils/productConfigs'; // Import from utils

const CategoryCreate = () => {
  const navigate = useNavigate();
  
  const categoryIcons = categoryIconService.categoryIcons;
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: 'FaTag',
    path: '',
    type: '',
    
    // NEW FIELDS
    productType: '',
    defaultColors: [],
    defaultSizes: [],
    sizeMeaning: '',
    
    description: '',
    isMainCategory: false,
    subcategories: [],
    subcategoriesDetailed: [],
    imageFile: null,
    bannerImageFile: null,
    imagePreview: '',
    bannerImagePreview: '',
    featured: false,
    isActive: true
  });
  
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  const filteredIcons = categoryIcons.filter(icon => 
    icon.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
    icon.value.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const generatePath = (name) => {
    return '/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const generateId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name === 'name') {
      const generatedId = generateId(value);
      const generatedPath = generatePath(value);
      
      setFormData(prev => ({
        ...prev,
        id: generatedId,
        path: generatedPath
      }));
    }
    
    if (name === 'id' && value) {
      setFormData(prev => ({
        ...prev,
        path: '/' + value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }));
    }
  };

  const handleProductTypeChange = (e) => {
    const productType = e.target.value.toLowerCase();
    const configs = getProductTypeConfigs(productType);
    
    setFormData(prev => ({ 
      ...prev, 
      productType: productType,
      sizeMeaning: configs.sizeMeaning,
      defaultColors: configs.colors,
      defaultSizes: configs.sizes
    }));
  };

  const handleIconSelect = (iconValue) => {
    setFormData(prev => ({
      ...prev,
      icon: iconValue
    }));
    setShowIconPicker(false);
    setIconSearch('');
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [type]: 'Only JPG, PNG, WebP, or GIF images are allowed' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [type]: 'Image size must be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'image') {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          bannerImageFile: file,
          bannerImagePreview: reader.result
        }));
      }
      
      if (errors[type]) {
        setErrors(prev => ({ ...prev, [type]: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (type) => {
    if (type === 'image') {
      setFormData(prev => ({
        ...prev,
        imageFile: null,
        imagePreview: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        bannerImageFile: null,
        bannerImagePreview: ''
      }));
    }
  };

  const handleSubcategoryChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
    
    setSubcategoryForm({
      name: '',
      description: ''
    });
    
    if (errors.subcategoryName) {
      setErrors(prev => ({ ...prev, subcategoryName: '' }));
    }
  };

  const handleRemoveSubcategory = (index) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
      subcategoriesDetailed: prev.subcategoriesDetailed.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id.trim()) newErrors.id = 'Category ID is required';
    else if (!/^[a-z0-9-]+$/.test(formData.id)) newErrors.id = 'ID can only contain lowercase letters, numbers, and hyphens';
    
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.icon.trim()) newErrors.icon = 'Icon is required';
    if (!formData.path.trim()) newErrors.path = 'Path is required';
    if (!formData.type.trim()) newErrors.type = 'Category type is required';
    if (!formData.productType.trim()) newErrors.productType = 'Product type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('id', formData.id.toLowerCase().trim());
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('icon', formData.icon);
      formDataToSend.append('path', formData.path.trim());
      formDataToSend.append('type', formData.type.trim());
      formDataToSend.append('productType', formData.productType.trim());
      formDataToSend.append('defaultColors', JSON.stringify(formData.defaultColors));
      formDataToSend.append('defaultSizes', JSON.stringify(formData.defaultSizes));
      formDataToSend.append('sizeMeaning', formData.sizeMeaning);
      formDataToSend.append('isMainCategory', formData.isMainCategory);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('subcategories', JSON.stringify(formData.subcategories));
      formDataToSend.append('subcategoriesDetailed', JSON.stringify(formData.subcategoriesDetailed));
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }
      if (formData.bannerImageFile) {
        formDataToSend.append('bannerImage', formData.bannerImageFile);
      }
      
      const response = await categoryService.createCategory(formDataToSend);
      
      if (response.success) {
        toast.success(`Category "${formData.name}" created successfully!`);
        
        setTimeout(() => {
          navigate('/categories');
        }, 2000);
      } else {
        toast.error(response?.data?.message || "Failed to create category.");
      }
      
    } catch (error) {
      console.error('Error creating category:', error);
    
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error ||
                            error.response.statusText ||
                            "Failed to create category.";
        toast.error(errorMessage);
        
        if (error.response.data?.errors) {
          error.response.data.errors.forEach(err => {
            toast.error(err);
          });
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create category. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const IconPreview = categoryIconService.getIconComponent(formData.icon);

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
            <p className="text-blue-100">Create a new product category with product configuration</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <FaTags className="text-3xl opacity-80" />
            </div>
          </div>
        </div>
      </div>

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
                Auto-generates: ID: {formData.id}, Path: {formData.path}
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon *
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl">
                    {IconPreview && <IconPreview />}
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50 flex justify-between items-center"
                    >
                      <span className="text-gray-700">
                        {categoryIcons.find(icon => icon.value === formData.icon)?.label || 'Select Icon'}
                      </span>
                      <span className="text-gray-400">▼</span>
                    </button>
                  </div>
                </div>
                
                {showIconPicker && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                      <div className="p-6 border-b">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-800">Select Icon</h3>
                          <button
                            type="button"
                            onClick={() => {
                              setShowIconPicker(false);
                              setIconSearch('');
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="relative">
                          <FaSearch className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            value={iconSearch}
                            onChange={(e) => setIconSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search icons..."
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      <div className="p-6 overflow-y-auto max-h-[50vh]">
                        {filteredIcons.length === 0 ? (
                          <p className="text-center text-gray-500 py-8">No icons found</p>
                        ) : (
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                            {filteredIcons.map((icon) => {
                              const IconComponent = categoryIconService.getIconComponent(icon.value);
                              return (
                                <button
                                  key={icon.value}
                                  type="button"
                                  onClick={() => handleIconSelect(icon.value)}
                                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 hover:border-blue-500 hover:bg-blue-50 transition-all ${
                                    formData.icon === icon.value
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200'
                                  }`}
                                >
                                  {IconComponent ? (
                                    <IconComponent className="w-6 h-6 text-gray-700" />
                                  ) : (
                                    <span className="text-2xl">{icon.value}</span>
                                  )}
                                  <span className="text-xs mt-2 text-gray-600 truncate w-full text-center">
                                    {icon.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6 border-t bg-gray-50">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setShowIconPicker(false);
                              setIconSearch('');
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.icon && (
                  <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
                )}
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

        {/* Product Configuration - NEW SECTION */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaBox className="text-blue-500" />
            <span>Product Configuration</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Type *
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Electronics, Fashion, Home"
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type *
              </label>
              <input
                type="text"
                name="productType"
                value={formData.productType}
                onChange={handleProductTypeChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.productType ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., phone, t-shirt, shoes, laptop"
                list="productTypeSuggestions"
              />
              <datalist id="productTypeSuggestions">
                <option value="phone" />
                <option value="laptop" />
                <option value="tablet" />
                <option value="t-shirt" />
                <option value="shirt" />
                <option value="pants" />
                <option value="jeans" />
                <option value="shoes" />
                <option value="sneakers" />
                <option value="watch" />
                <option value="book" />
                <option value="furniture" />
                <option value="bag" />
                <option value="jacket" />
              </datalist>
              {errors.productType && (
                <p className="mt-1 text-sm text-red-600">{errors.productType}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                This tells the system what colors and sizes mean for products
              </p>
            </div>

            {formData.productType && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size System
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FaRuler className="text-gray-400" />
                      <div>
                        <p className="font-medium">{formData.sizeMeaning}</p>
                        <p className="text-sm text-gray-600">
                          {getProductTypeConfigs(formData.productType).sizeDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Sizes
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {formData.defaultSizes.map((size, index) => (
                        <span key={index} className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-full text-sm">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {formData.productType && formData.defaultColors.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Default Colors
              </label>
              <div className="flex flex-wrap gap-4">
                {formData.defaultColors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-12 h-12 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                    <span className="text-xs mt-2 text-gray-700">{color.name}</span>
                    <span className="text-xs text-gray-500">({color.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaLayerGroup className="text-blue-500" />
            <span>Category Settings</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
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
        </div>

        {/* Subcategories Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaFolderOpen className="text-blue-500" />
            <span>Subcategories</span>
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="font-medium text-gray-800 mb-4">Add New Subcategory</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={subcategoryForm.name}
                  onChange={handleSubcategoryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Laptops, Mobiles, Accessories"
                />
                {errors.subcategoryName && (
                  <p className="mt-1 text-sm text-red-600">{errors.subcategoryName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
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
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Subcategory</span>
              </button>
            </div>
          </div>

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
                        className="text-gray-500 hover:text-red-500 p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        ID: {subcat.name.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {subcat.totalProducts || 0} products
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
            </div>
          )}
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaImage className="text-blue-500" />
            <span>Category Images</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Category Image
              </label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {formData.imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto w-48 h-48">
                        <img 
                          src={formData.imagePreview} 
                          alt="Category preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('image')}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">Image preview</p>
                    </div>
                  ) : (
                    <>
                      <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload category image</p>
                      <p className="text-sm text-gray-500 mb-4">JPG, PNG, WebP or GIF (Max 5MB)</p>
                      <label className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'image')}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Banner Image
              </label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {formData.bannerImagePreview ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto w-full h-32">
                        <img 
                          src={formData.bannerImagePreview} 
                          alt="Banner preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('bannerImage')}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">Banner preview</p>
                    </div>
                  ) : (
                    <>
                      <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload banner image</p>
                      <p className="text-sm text-gray-500 mb-4">JPG, PNG, WebP or GIF (Max 5MB)</p>
                      <label className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'bannerImage')}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>
                {errors.bannerImage && (
                  <p className="mt-1 text-sm text-red-600">{errors.bannerImage}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="text-sm text-gray-600">
              <p>Fields marked with * are required</p>
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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <FaInfoCircle className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Product Configuration Guide</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li><strong>Product Type</strong> tells the system what products go in this category</li>
              <li><strong>Phone</strong> → Colors = phone finishes, Sizes = storage capacity</li>
              <li><strong>T-shirt</strong> → Colors = fabric colors, Sizes = clothing sizes</li>
              <li><strong>Shoes</strong> → Colors = upper colors, Sizes = shoe sizes</li>
              <li><strong>Watch</strong> → Colors = case/strap colors, Sizes = case size</li>
              <li>Products added to this category will use these colors and sizes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;