// src/pages/categories/CategoryEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
  FaEdit,
  FaSpinner,
  FaCloudUploadAlt,
  FaTimesCircle,
  FaSearch
} from 'react-icons/fa';
import * as categoryIconService from '../../services/icons';
import { useProducts } from '../../context/ProductContext';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    categories, 
    getCategoryById, 
    categoriesLoading,
    updateCategoryFeatured,
    updateCategoryStatus,
    deleteCategory,
    fetchCategories,
    fetchProductsCountForCategories
  } = useProducts();
  
  // Get icons from service
  const categoryIcons = categoryIconService.categoryIcons;
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    id: '',
    name: '',
    icon: 'FaTag',
    path: '',
    type: '',
    
    // Details
    description: '',
    isMainCategory: false,
    
    // Subcategories
    subcategories: [],
    subcategoriesDetailed: [],
    
    // Images
    image: '',
    bannerImage: '',
    imageFile: null,
    bannerImageFile: null,
    imagePreview: '',
    bannerImagePreview: '',
    
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
  const [iconSearch, setIconSearch] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Filter icons based on search
  const filteredIcons = categoryIcons.filter(icon => 
    icon.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
    icon.value.toLowerCase().includes(iconSearch.toLowerCase())
  );

  // Get icon preview component
  const IconPreview = categoryIconService.getIconComponent(formData.icon);

  // Auto-generate path from name
  const generatePath = (name) => {
    return '/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Load category data
  useEffect(() => {
    if (id) {
      loadCategoryData();
      loadActivityLogs();
    }
  }, [id, categories]);

  const loadCategoryData = async () => {
    try {
      // Get category from context
      const categoryData = getCategoryById(id);
      
      if (!categoryData) {
        toast.error('Category not found');
        navigate('/categories');
        return;
      }
      
      console.log('Category data:', categoryData);
      
      // Set form data with actual category data
      setFormData({
        id: categoryData.id || '',
        name: categoryData.name || '',
        icon: categoryData.icon || 'FaTag',
        path: categoryData.path || '',
        type: categoryData.type || '',
        description: categoryData.description || '',
        isMainCategory: categoryData.isMainCategory || false,
        subcategories: categoryData.subcategories || [],
        subcategoriesDetailed: categoryData.subcategoriesDetailed || [],
        image: categoryData.image || '',
        bannerImage: categoryData.bannerImage || '',
        imageFile: null,
        bannerImageFile: null,
        imagePreview: categoryData.image || '',
        bannerImagePreview: categoryData.bannerImage || '',
        order: categoryData.order || 0,
        featured: categoryData.featured || false,
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
        totalProducts: categoryData.totalProducts || 0
      });
      
    } catch (error) {
      console.error('Error loading category:', error);
      toast.error('Failed to load category data');
    }
  };

  // Load activity logs (you can implement this with your API)
  const loadActivityLogs = async () => {
    try {
      // For now, using mock data. Replace with actual API call.
      const mockLogs = [
        { id: 1, action: 'Category Created', timestamp: new Date().toISOString(), details: 'Added to catalog' },
        { id: 2, action: 'Subcategory Added', timestamp: new Date().toISOString(), details: 'Added new subcategory' },
      ];
      
      setActivityLogs(mockLogs);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    }
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
      const generatedPath = generatePath(value);
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

  // Handle icon selection
  const handleIconSelect = (iconValue) => {
    setFormData(prev => ({
      ...prev,
      icon: iconValue
    }));
    setShowIconPicker(false);
    setIconSearch('');
  };

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [type]: 'Only JPG, PNG, WebP, or GIF images are allowed' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [type]: 'Image size must be less than 5MB' }));
      return;
    }

    // Create preview
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
      
      // Clear error
      if (errors[type]) {
        setErrors(prev => ({ ...prev, [type]: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = (type) => {
    if (type === 'image') {
      setFormData(prev => ({
        ...prev,
        imageFile: null,
        imagePreview: '',
        image: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        bannerImageFile: null,
        bannerImagePreview: '',
        bannerImage: ''
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

  // Remove subcategory
  const handleRemoveSubcategory = (index) => {
    const subcategoryName = formData.subcategoriesDetailed[index]?.name || '';
    
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
    if (!formData.type.trim()) newErrors.type = 'Category type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('id', formData.id.toLowerCase().trim());
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('icon', formData.icon);
      formDataToSend.append('path', formData.path.trim());
      formDataToSend.append('type', formData.type.trim());
      formDataToSend.append('isMainCategory', formData.isMainCategory);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('isActive', formData.isActive);
      
      // Add subcategories as JSON
      formDataToSend.append('subcategories', JSON.stringify(formData.subcategories));
      formDataToSend.append('subcategoriesDetailed', JSON.stringify(formData.subcategoriesDetailed));
      
      // Add image files if they exist
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      } else if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      if (formData.bannerImageFile) {
        formDataToSend.append('bannerImage', formData.bannerImageFile);
      } else if (formData.bannerImage) {
        formDataToSend.append('bannerImage', formData.bannerImage);
      }
      
      // Call API service - you need to create an updateCategory function in your categoryService
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Category "${formData.name}" updated successfully!`);
        
        // Refresh categories list
        await fetchCategories();
        await fetchProductsCountForCategories();
        
        // Navigate back to categories list
        setTimeout(() => {
          navigate('/categories');
        }, 1500);
      } else {
        throw new Error(data.message || 'Failed to update category');
      }
      
    } catch (error) {
      console.error('Error updating category:', error);
      
      // Handle different error formats
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error ||
                            error.response.statusText ||
                            "Failed to update category.";
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
        toast.error("Failed to update category. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!window.confirm(`Are you sure you want to delete "${formData.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      navigate('/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || "Failed to delete category");
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = async () => {
    try {
      await updateCategoryFeatured(id, !formData.featured);
      setFormData(prev => ({ ...prev, featured: !prev.featured }));
      
      // Add activity log
      const newLog = {
        id: activityLogs.length + 1,
        action: 'Featured Status',
        timestamp: new Date().toISOString(),
        details: `Marked as ${!formData.featured ? 'featured' : 'not featured'}`
      };
      setActivityLogs(prev => [newLog, ...prev]);
      
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error(error.message || "Failed to update featured status");
    }
  };

  // Handle toggle status
  const handleToggleStatus = async () => {
    try {
      await updateCategoryStatus(id, !formData.isActive);
      setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
      
      // Add activity log
      const newLog = {
        id: activityLogs.length + 1,
        action: 'Status Changed',
        timestamp: new Date().toISOString(),
        details: `Marked as ${!formData.isActive ? 'active' : 'inactive'}`
      };
      setActivityLogs(prev => [newLog, ...prev]);
      
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error(error.message || "Failed to update status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category data...</p>
        </div>
      </div>
    );
  }

  if (!formData.id && !categoriesLoading) {
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
                <p className="font-mono text-sm">{formData.id}</p>
              </div>
              <FaTags className="text-3xl opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
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
              <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-4xl">
                {IconPreview && <IconPreview />}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{formData.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <FaShoppingCart className="text-gray-400" />
                    <span className="font-medium text-gray-600">{formData.totalProducts || 0} products</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </div>
                  {formData.featured && (
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <FaStar />
                      <span>Featured</span>
                    </div>
                  )}
                  {formData.isMainCategory && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Main Category
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-2 capitalize">
                    <span>{formData.type}</span>
                  </div>
                  <span>•</span>
                  <span>Path: {formData.path}</span>
                  <span>•</span>
                  <span>Subcategories: {formData.subcategories.length}</span>
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
                    
                    {/* Icon Picker Modal */}
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
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.type ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Electronics, Fashion, Home, etc."
                  />
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
                            <div>
                              <h5 className="font-medium text-gray-800">{subcat.name}</h5>
                              {subcat.description && (
                                <p className="text-sm text-gray-600 mt-1">{subcat.description}</p>
                              )}
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
                          <p className="text-sm text-gray-600">Current image</p>
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

                {/* Banner Image */}
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
                          <p className="text-sm text-gray-600">Current banner</p>
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
                onClick={() => window.open(`/categories/${formData.id}`, '_blank')}
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
                onClick={handleToggleFeatured}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{formData.featured ? 'Remove Featured' : 'Mark as Featured'}</p>
                    <p className="text-sm text-gray-600">{formData.featured ? 'Remove from homepage' : 'Feature on homepage'}</p>
                  </div>
                  <FaStar className={formData.featured ? "text-yellow-500" : "text-gray-400"} />
                </div>
              </button>

              <button
                onClick={handleToggleStatus}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{formData.isActive ? 'Deactivate' : 'Activate'}</p>
                    <p className="text-sm text-gray-600">{formData.isActive ? 'Hide from customers' : 'Show to customers'}</p>
                  </div>
                  {formData.isActive ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
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
                <p className="text-2xl font-bold text-gray-800">{formData.totalProducts || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subcategories</p>
                <p className="text-2xl font-bold text-blue-600">{formData.subcategories.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Display Order</p>
                <p className="text-2xl font-bold text-yellow-600">#{formData.order || 0}</p>
              </div>
            </div>
          </div>

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
                    <span>Changing ID may affect existing URLs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Main categories appear in navigation</span>
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
      </div>
    </div>
  );
};

export default CategoryEdit;