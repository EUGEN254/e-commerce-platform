// src/pages/products/ProductEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FaSave,
  FaHistory,
  FaShoppingCart,
  FaEye
} from 'react-icons/fa';

const ProductEdit = () => {
  const { id } = useParams();
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

  // Product state
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
    status: 'active',
    
    // Ratings (readonly)
    rating: 0,
    reviewCount: 0
  });
  
  // Form errors
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Activity logs
  const [activityLogs, setActivityLogs] = useState([]);
  
  // Temporary states for tags and features
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '', '']);

  // Load product data
  useEffect(() => {
    loadProductData();
    loadActivityLogs();
  }, [id]);

  // Mock API call to load product data
  const loadProductData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock product data based on your Product model
      const mockProduct = {
        _id: id,
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Air Max technology. Perfect for daily wear and sports activities.',
        shortDescription: 'Premium running shoes with maximum comfort',
        price: 129.99,
        originalPrice: 149.99,
        discount: 13.3,
        category: 'shoes',
        subcategory: 'running',
        brand: 'Nike',
        mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=400'
        ],
        colors: [
          { name: 'Black', hex: '#000000', value: 'black' },
          { name: 'White', hex: '#FFFFFF', value: 'white' }
        ],
        sizes: ['8', '9', '10', '11'],
        tags: ['sports', 'running', 'comfort', 'nike'],
        features: ['Air cushioning', 'Breathable mesh', 'Lightweight design', 'Durable sole'],
        specs: {
          'Material': 'Mesh & Synthetic',
          'Weight': '320g',
          'Closure': 'Lace-up',
          'Season': 'All Season'
        },
        stock: 150,
        inStock: true,
        rating: 4.5,
        reviewCount: 234,
        isFeatured: true,
        status: 'active',
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: '2024-01-15T14:20:00Z'
      };
      
      setProduct(mockProduct);
      
      // Convert specs object to array for form
      const specsArray = Object.entries(mockProduct.specs || {}).map(([key, value]) => ({
        key,
        value
      }));
      
      // Set form data
      setFormData({
        name: mockProduct.name,
        description: mockProduct.description,
        shortDescription: mockProduct.shortDescription,
        price: mockProduct.price.toString(),
        originalPrice: mockProduct.originalPrice.toString(),
        discount: mockProduct.discount.toString(),
        category: mockProduct.category,
        subcategory: mockProduct.subcategory,
        brand: mockProduct.brand,
        mainImage: mockProduct.mainImage,
        images: mockProduct.images,
        colors: mockProduct.colors,
        sizes: mockProduct.sizes,
        tags: mockProduct.tags,
        features: mockProduct.features,
        specs: specsArray.length > 0 ? specsArray : [{ key: '', value: '' }],
        stock: mockProduct.stock.toString(),
        inStock: mockProduct.inStock,
        isFeatured: mockProduct.isFeatured,
        status: mockProduct.status,
        rating: mockProduct.rating,
        reviewCount: mockProduct.reviewCount
      });
      
      // Set image URLs
      const urls = [...mockProduct.images];
      while (urls.length < 4) urls.push('');
      setImageUrls(urls.slice(0, 4));
      
    } catch (error) {
      console.error('Error loading product:', error);
      setErrors({ load: 'Failed to load product data' });
    } finally {
      setIsLoading(false);
    }
  };

  // Load activity logs
  const loadActivityLogs = async () => {
    // Mock activity logs
    const mockLogs = [
      { id: 1, action: 'Product Created', timestamp: '2024-01-10T10:30:00Z', details: 'Added to catalog' },
      { id: 2, action: 'Price Updated', timestamp: '2024-01-12T14:20:00Z', details: 'Price changed from $149.99 to $129.99' },
      { id: 3, action: 'Stock Updated', timestamp: '2024-01-13T09:45:00Z', details: 'Stock increased by 50 units' },
      { id: 4, action: 'Featured Status', timestamp: '2024-01-14T11:30:00Z', details: 'Marked as featured product' },
      { id: 5, action: 'Review Added', timestamp: '2024-01-15T08:30:00Z', details: 'New 5-star review from user123' },
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
    
    setIsSaving(true);
    
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
        isFeatured: formData.isFeatured,
        status: formData.status,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Updating product:', productData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update product state
      setProduct(prev => ({
        ...prev,
        ...productData,
        _id: id
      }));
      
      // Add activity log
      const newLog = {
        id: activityLogs.length + 1,
        action: 'Product Updated',
        timestamp: new Date().toISOString(),
        details: 'Product information was updated'
      };
      
      setActivityLogs(prev => [newLog, ...prev]);
      
      // Show success message
      setSuccessMessage('Product updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error updating product:', error);
      setErrors({ submit: 'Failed to update product. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Deleting product:', id);
      navigate('/products');
      
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrors({ submit: 'Failed to delete product.' });
      setIsSaving(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  // Get available sizes based on category
  const getAvailableSizes = () => {
    if (formData.category && commonSizes[formData.category]) {
      return commonSizes[formData.category];
    }
    return commonSizes.default;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Products
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
                onClick={() => navigate('/products')}
                className="p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-2xl font-bold">Edit Product</h2>
            </div>
            <p className="text-blue-100">Update product details and settings</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm text-blue-100">Product ID</p>
                <p className="font-mono text-sm">{product._id}</p>
              </div>
              <FaBox className="text-3xl opacity-80" />
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
        {/* Left Column - Product Info & Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={product.mainImage} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-gray-500">({product.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaShoppingCart className="text-gray-400" />
                    <span className="text-gray-600">Stock: {product.stock}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                  {product.isFeatured && (
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <FaFire />
                      <span>Featured</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCategoryIcon(product.category)}</span>
                    <span className="capitalize">{product.category}</span>
                  </div>
                  <span>•</span>
                  <span>Brand: {product.brand}</span>
                  <span>•</span>
                  <span>Last Updated: {formatDate(product.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
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

            {/* Save Button */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
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

        {/* Right Column - Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FaBox className="text-blue-500" />
              <span>Quick Actions</span>
            </h4>
            
            <div className="space-y-3">
              <button
                onClick={() => window.open(`/products/${id}`, '_blank')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">View Product</p>
                    <p className="text-sm text-gray-600">Open in new tab</p>
                  </div>
                  <FaEye className="text-gray-400" />
                </div>
              </button>

              <button
                onClick={handleDeleteProduct}
                disabled={isSaving}
                className="w-full text-left p-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-700">Delete Product</p>
                    <p className="text-sm text-red-600">Permanently remove</p>
                  </div>
                  <FaTrash className="text-red-500" />
                </div>
              </button>
            </div>
          </div>

          {/* Product Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Product Statistics</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(parseFloat(formData.price))}</p>
                {formData.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(parseFloat(formData.originalPrice))}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Discount</p>
                <p className="text-2xl font-bold text-green-600">{formData.discount}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(parseFloat(formData.price) * parseInt(formData.stock))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(formData.rating)
                            ? 'text-yellow-400'
                            : i < formData.rating
                            ? 'text-yellow-300'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-800">{formData.rating}</span>
                  <span className="text-gray-500">({formData.reviewCount})</span>
                </div>
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
              
              {activityLogs.length > 5 && (
                <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2">
                  View All Activity
                </button>
              )}
            </div>
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Editing Notes</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Price changes affect inventory value</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Stock updates are logged in activity</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Featured products appear on homepage</span>
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

export default ProductEdit;