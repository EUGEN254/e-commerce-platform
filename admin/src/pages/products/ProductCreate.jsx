// src/pages/products/ProductCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBox, 
  FaArrowLeft, 
  FaImage, 
  FaTag,
  FaLayerGroup,
  FaDollarSign,
  FaPercent,
  FaPalette,
  FaRuler,
  FaList,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaUpload,
  FaTrash,
  FaStar,
  FaFire,
  FaSave
} from 'react-icons/fa';

const ProductCreate = () => {
  const navigate = useNavigate();
  
  // Categories based on your model
  const categories = [
    { value: 'shoes', label: '👟 Shoes' },
    { value: 'clothing', label: '👕 Clothing' },
    { value: 'electronics', label: '💻 Electronics' },
    { value: 'accessories', label: '🕶️ Accessories' },
    { value: 'home', label: '🏠 Home' },
    { value: 'mobile', label: '📱 Mobile' },
    { value: 'beauty', label: '💄 Beauty' },
    { value: 'sports', label: '⚽ Sports' },
    { value: 'books', label: '📚 Books' },
    { value: 'fashion', label: '👗 Fashion' }
  ];

  // Common subcategories for each category
  const subcategories = {
    shoes: ['Running', 'Casual', 'Sports', 'Formal', 'Sneakers'],
    clothing: ['T-Shirts', 'Shirts', 'Pants', 'Jackets', 'Dresses'],
    electronics: ['TVs', 'Audio', 'Computers', 'Gaming', 'Smart Home'],
    accessories: ['Watches', 'Bags', 'Jewelry', 'Sunglasses', 'Belts'],
    home: ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Lighting'],
    mobile: ['Smartphones', 'Tablets', 'Wearables', 'Accessories'],
    beauty: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'],
    sports: ['Equipment', 'Apparel', 'Footwear', 'Accessories'],
    books: ['Fiction', 'Non-Fiction', 'Educational', 'Children'],
    fashion: ['Women', 'Men', 'Kids', 'Unisex']
  };

  // Common sizes
  const commonSizes = {
    clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    shoes: ['7', '8', '9', '10', '11', '12'],
    default: ['One Size']
  };

  // Common colors
  const commonColors = [
    { name: 'Black', hex: '#000000', value: 'black' },
    { name: 'White', hex: '#FFFFFF', value: 'white' },
    { name: 'Red', hex: '#DC2626', value: 'red' },
    { name: 'Blue', hex: '#2563EB', value: 'blue' },
    { name: 'Green', hex: '#059669', value: 'green' },
    { name: 'Yellow', hex: '#D97706', value: 'yellow' },
    { name: 'Purple', hex: '#7C3AED', value: 'purple' },
    { name: 'Gray', hex: '#6B7280', value: 'gray' },
    { name: 'Brown', hex: '#92400E', value: 'brown' },
    { name: 'Pink', hex: '#DB2777', value: 'pink' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    shortDescription: '',
    
    // Pricing
    price: '',
    originalPrice: '',
    discount: '',
    
    // Categorization
    category: '',
    subcategory: '',
    brand: '',
    
    // Images
    mainImage: '',
    images: [],
    
    // Variants
    colors: [],
    sizes: [],
    
    // Details
    tags: [],
    features: [],
    specs: [{ key: '', value: '' }],
    
    // Stock & Status
    stock: '',
    inStock: true,
    isFeatured: false,
    status: 'active'
  });
  
  // Form errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Temporary states for tags and features
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '', '']);

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
    
    // Auto-calculate discount if both prices are provided
    if (name === 'price' || name === 'originalPrice') {
      const price = parseFloat(formData.price) || 0;
      const originalPrice = parseFloat(formData.originalPrice) || 0;
      
      if (originalPrice > 0 && price > 0) {
        const discount = ((originalPrice - price) / originalPrice * 100).toFixed(1);
        setFormData(prev => ({ ...prev, discount: discount > 0 ? discount : '0' }));
      }
    }
    
    // Auto-calculate price if discount is provided
    if (name === 'discount' && formData.originalPrice) {
      const originalPrice = parseFloat(formData.originalPrice);
      const discount = parseFloat(value) || 0;
      if (originalPrice > 0 && discount >= 0 && discount <= 100) {
        const price = originalPrice * (1 - discount / 100);
        setFormData(prev => ({ ...prev, price: price.toFixed(2) }));
      }
    }
  };

  // Handle array fields
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Handle colors
  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.find(c => c.value === color.value)
        ? prev.colors.filter(c => c.value !== color.value)
        : [...prev.colors, color]
    }));
  };

  // Handle sizes
  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Handle specs
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }]
    }));
  };

  const handleRemoveSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  // Handle images
  const handleImageUrlChange = (index, url) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = url;
    setImageUrls(newImageUrls);
    
    if (url.trim()) {
      const allImages = newImageUrls.filter(img => img.trim());
      setFormData(prev => ({ ...prev, images: allImages }));
      
      // Set first image as main image if not set
      if (!formData.mainImage && index === 0) {
        setFormData(prev => ({ ...prev, mainImage: url.trim() }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.mainImage.trim()) newErrors.mainImage = 'Main image is required';
    if (!formData.stock && formData.stock !== 0) newErrors.stock = 'Stock quantity is required';
    
    // Validate URLs
    if (formData.mainImage && !isValidUrl(formData.mainImage)) {
      newErrors.mainImage = 'Please enter a valid image URL';
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
      // Prepare product data based on your model
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand.trim(),
        mainImage: formData.mainImage.trim(),
        images: formData.images.filter(img => img.trim()),
        colors: formData.colors,
        sizes: formData.sizes,
        tags: formData.tags,
        features: formData.features,
        specs: formData.specs.reduce((acc, spec) => {
          if (spec.key && spec.value) {
            acc[spec.key] = spec.value;
          }
          return acc;
        }, {}),
        stock: parseInt(formData.stock) || 0,
        inStock: formData.inStock,
        rating: 0,
        reviewCount: 0,
        isFeatured: formData.isFeatured,
        status: formData.status
      };
      
      console.log('Creating product:', productData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSuccessMessage(`Product "${formData.name}" created successfully!`);
      
      // Reset form after 2 seconds and redirect
      setTimeout(() => {
        navigate('/products');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors({ submit: 'Failed to create product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get available sizes based on category
  const getAvailableSizes = () => {
    if (formData.category && commonSizes[formData.category]) {
      return commonSizes[formData.category];
    }
    return commonSizes.default;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => navigate('/products')}
                className="p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-2xl font-bold">Add New Product</h2>
            </div>
            <p className="text-blue-100">Create a new product for your catalog</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <FaBox className="text-3xl opacity-80" />
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
              <p className="text-green-600 text-sm">Redirecting to products list...</p>
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
            <FaBox className="text-blue-500" />
            <span>Basic Information</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.brand ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter brand name"
              />
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description (Optional)
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description (max 500 characters)"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.shortDescription.length}/500 characters
              </p>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Detailed product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaDollarSign className="text-blue-500" />
            <span>Pricing</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (Optional)
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Original price"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price *
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Selling price"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount %
              </label>
              <div className="relative">
                <FaPercent className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Discount percentage"
                />
              </div>
              {formData.originalPrice && formData.price && (
                <p className="mt-2 text-sm text-green-600">
                  Discount: {((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice) * 100).toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaLayerGroup className="text-blue-500" />
            <span>Categorization</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory *
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                disabled={!formData.category}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.subcategory ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Subcategory</option>
                {formData.category && subcategories[formData.category]?.map(sub => (
                  <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                ))}
              </select>
              {errors.subcategory && (
                <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaImage className="text-blue-500" />
            <span>Product Images</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image URL *
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="url"
                  name="mainImage"
                  value={formData.mainImage}
                  onChange={handleChange}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mainImage ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.mainImage && (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                    <img 
                      src={formData.mainImage} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
              </div>
              {errors.mainImage && (
                <p className="mt-1 text-sm text-red-600">{errors.mainImage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Additional Images (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    <input
                      type="url"
                      value={imageUrls[index]}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder={`Image ${index + 2} URL`}
                    />
                    {imageUrls[index] && (
                      <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                        <img 
                          src={imageUrls[index]} 
                          alt={`Preview ${index + 2}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaPalette className="text-blue-500" />
            <span>Variants</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Available Colors
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {commonColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleColorToggle(color)}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                      formData.colors.find(c => c.value === color.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full mb-2 border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-medium text-gray-700">{color.name}</span>
                  </button>
                ))}
              </div>
              {formData.colors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Selected Colors:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full"
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm text-gray-700">{color.name}</span>
                        <button
                          type="button"
                          onClick={() => handleColorToggle(color)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Available Sizes
              </label>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {getAvailableSizes().map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.sizes.includes(size)
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                {formData.sizes.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Selected Sizes:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map((size, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full"
                        >
                          <span className="text-sm text-gray-700">{size}</span>
                          <button
                            type="button"
                            onClick={() => handleSizeToggle(size)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tags & Features */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaTag className="text-blue-500" />
            <span>Tags & Features</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Product Tags
              </label>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Key Features
              </label>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.features.length > 0 && (
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FaCheck className="text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaList className="text-blue-500" />
            <span>Specifications</span>
          </h3>
          
          <div className="space-y-4">
            {formData.specs.map((spec, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Specification name"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Specification value"
                />
                {formData.specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddSpec}
              className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              + Add Specification
            </button>
          </div>
        </div>

        {/* Stock & Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <FaBox className="text-blue-500" />
            <span>Stock & Status</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stock ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter stock quantity"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                In Stock
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, inStock: true }))}
                  className={`px-4 py-2 rounded-lg border ${
                    formData.inStock
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, inStock: false }))}
                  className={`px-4 py-2 rounded-lg border ${
                    !formData.inStock
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Featured Product
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isFeatured" className="flex items-center space-x-2">
                  <FaFire className="text-yellow-500" />
                  <span>Mark as featured</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
                onClick={() => navigate('/products')}
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
                    <span>Create Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;