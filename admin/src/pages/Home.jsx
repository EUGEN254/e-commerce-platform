import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaImage, FaPlus, FaTrash } from 'react-icons/fa';

const AddProduct = () => {
  // Main product state
  const [product, setProduct] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    discount: '',
    category: '',
    subcategory: '',
    brand: '',
    stock: '',
    tags: [],
    features: [],
    specs: {},
    colors: [],
    sizes: [],
    isFeatured: false,
    status: 'active'
  });

  // Image handling - SEPARATE main and additional
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  // Temporary inputs
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [colorInput, setColorInput] = useState({ name: '', hex: '#000000' });
  const [sizeInput, setSizeInput] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Categories from your assets
  const categories = [
    { value: 'shoes', label: 'Shoes' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'home', label: 'Home' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'sports', label: 'Sports' },
    { value: 'books', label: 'Books' },
    { value: 'fashion', label: 'Fashion' }
  ];

  // Subcategories based on main category
  const subcategories = {
    shoes: ['Sneakers', 'Formal', 'Sports', 'Boots', 'Heels', 'Sandals'],
    clothing: ['T-Shirts', 'Shirts', 'Jeans', 'Dresses', 'Jackets', 'Activewear', 'Hoodies'],
    electronics: ['Laptops', 'Smartphones', 'Headphones', 'Wearables', 'Home Electronics'],
    accessories: ['Bags', 'Watches', 'Jewelry', 'Sunglasses', 'Belts', 'Wallets'],
    home: ['Furniture', 'Kitchen', 'Decor', 'Lighting'],
    mobile: ['Smartphones', 'Tablets', 'Accessories'],
    beauty: ['Skincare', 'Makeup', 'Fragrances', 'Hair Care'],
    sports: ['Fitness Equipment', 'Sportswear', 'Outdoor Gear'],
    books: ['Fiction', 'Non-Fiction', 'Academic', 'Children'],
    fashion: ["Men's Fashion", "Women's Fashion", "Kids Fashion", "Seasonal"]
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle MAIN image upload
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle ADDITIONAL images upload
  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const currentCount = additionalImageFiles.length;
      const maxAdditional = 10 - currentCount;
      
      if (maxAdditional > 0) {
        const newFiles = files.slice(0, maxAdditional);
        const updatedFiles = [...additionalImageFiles, ...newFiles];
        
        setAdditionalImageFiles(updatedFiles);
        
        // Create previews for new files
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
      } else {
        alert('Maximum of 10 additional images reached');
      }
    }
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    const newFiles = [...additionalImageFiles];
    const newPreviews = [...additionalImagePreviews];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setAdditionalImageFiles(newFiles);
    setAdditionalImagePreviews(newPreviews);
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !product.tags.includes(tagInput.trim())) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (index) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Add feature
  const addFeature = () => {
    if (featureInput.trim() && !product.features.includes(featureInput.trim())) {
      setProduct(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    setProduct(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Add spec
  const addSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setProduct(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  // Remove spec
  const removeSpec = (key) => {
    const newSpecs = { ...product.specs };
    delete newSpecs[key];
    setProduct(prev => ({
      ...prev,
      specs: newSpecs
    }));
  };

  // Add color
  const addColor = () => {
    if (colorInput.name.trim()) {
      const newColor = {
        name: colorInput.name.trim(),
        hex: colorInput.hex,
        value: colorInput.name.trim().toLowerCase()
      };
      
      setProduct(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
      setColorInput({ name: '', hex: '#000000' });
    }
  };

  // Remove color
  const removeColor = (index) => {
    setProduct(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  // Add size
  const addSize = () => {
    if (sizeInput.trim() && !product.sizes.includes(sizeInput.trim())) {
      setProduct(prev => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()]
      }));
      setSizeInput('');
    }
  };

  // Remove size
  const removeSize = (index) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

     console.log('Product data to send:', {
    name: product.name,
    colors: product.colors,
    sizes: product.sizes,
    colorsType: typeof product.colors,
    sizesType: typeof product.sizes
  });
  
  // Debug: Log each color object
  product.colors.forEach((color, index) => {
    console.log(`Color ${index}:`, color);
  });
  
    
    try {
      const formData = new FormData();
      
      // Append all product data
      Object.keys(product).forEach(key => {
        if (key === 'colors' || key === 'specs') {
          formData.append(key, JSON.stringify(product[key]));
        } else if (key === 'tags' || key === 'features' || key === 'sizes') {
          formData.append(key, JSON.stringify(product[key]));
        } else {
          formData.append(key, product[key]);
        }
      });
      
      // Append main image
      if (mainImageFile) {
        formData.append('images', mainImageFile);
      }
      
      // Append additional images
      additionalImageFiles.forEach(image => {
        formData.append('images', image);
      });
      
      const response = await axios.post(`${backendUrl}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        alert('Product created successfully!');
        // Reset form
        setProduct({
          name: '',
          description: '',
          shortDescription: '',
          price: '',
          originalPrice: '',
          discount: '',
          category: '',
          subcategory: '',
          brand: '',
          stock: '',
          tags: [],
          features: [],
          specs: {},
          colors: [],
          sizes: [],
          isFeatured: false,
          status: 'active'
        });
        setMainImageFile(null);
        setMainImagePreview('');
        setAdditionalImageFiles([]);
        setAdditionalImagePreviews([]);
      }
      
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error.response?.data?.message || 'Error creating product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
          <p className="text-gray-600 mb-6">Fill in the details to add a new product to your store</p>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Premium Running Shoes"
                  />
                </div>
                
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={product.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Nike"
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory *
                  </label>
                  <select
                    name="subcategory"
                    value={product.subcategory}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={!product.category}
                  >
                    <option value="">Select Subcategory</option>
                    {product.category && subcategories[product.category]?.map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Detailed product description..."
                />
              </div>
              
              {/* Short Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={product.shortDescription}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief summary of the product"
                  maxLength="500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {product.shortDescription.length}/500 characters
                </p>
              </div>
            </div>
            
            {/* Pricing Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Stock</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="89.99"
                  />
                </div>
                
                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={product.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="119.99"
                  />
                </div>
                
                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={product.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="25"
                  />
                </div>
              </div>
              
              {/* Stock */}
              <div className="mt-6 max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="50"
                />
              </div>
              
              {/* Status & Featured */}
              <div className="mt-6 flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={product.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mark as Featured Product</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={product.status === 'active'}
                    onChange={(e) => setProduct(prev => ({
                      ...prev,
                      status: e.target.checked ? 'active' : 'inactive'
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            
            {/* Images Section - UPDATED */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Images</h2>
              
              {/* Main Image */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Main Product Image *
                </label>
                
                <div className="flex items-center gap-6">
                  {/* Main Image Preview */}
                  {mainImagePreview ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={mainImagePreview}
                        alt="Main product"
                        className="w-full h-full object-cover rounded-lg border-2 border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMainImagePreview('');
                          setMainImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                      <FaImage className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div>
                    <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors">
                      <FaUpload className="w-4 h-4 mr-2" />
                      {mainImagePreview ? 'Change Main Image' : 'Upload Main Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      This will be the primary display image
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Additional Images (Optional)
                </label>
                
                <div className="mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Upload additional product images</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Show different angles, details, or variations (Max 10 images)
                    </p>
                    
                    <label className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                      <FaImage className="w-4 h-4 mr-2" />
                      Add More Images
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleAdditionalImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                {/* Additional Images Previews */}
                {additionalImagePreviews.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Additional Images ({additionalImagePreviews.length}/10)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                            <img
                              src={preview}
                              alt={`Additional ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Variants Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Variants</h2>
              
              {/* Colors */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colors
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={colorInput.name}
                      onChange={(e) => setColorInput(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Color name (e.g., Red)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <input
                      type="color"
                      value={colorInput.hex}
                      onChange={(e) => setColorInput(prev => ({ ...prev, hex: e.target.value }))}
                      className="h-10 w-10 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Color chips */}
                {product.colors.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full"
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sizes
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      placeholder="Size (e.g., M, 10, One Size)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Size chips */}
                {product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.sizes.map((size, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full"
                      >
                        <span>{size}</span>
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Tags & Features Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags & Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Tag chips */}
                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-indigo-500 hover:text-indigo-700"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Add a feature"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Feature list */}
                  {product.features.length > 0 && (
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            
            {/* Specifications Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Specifications</h2>
              
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      placeholder="Specification name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      placeholder="Specification value"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={addSpec}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add Specification
                    </button>
                  </div>
                </div>
                
                {/* Specs list */}
                {Object.keys(product.specs).length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Added Specifications</h3>
                    <div className="space-y-3">
                      {Object.entries(product.specs).map(([key, value], index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-800">{key}:</span>
                            <span className="ml-2 text-gray-600">{value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSpec(key)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Product
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Form Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">How to use this form:</h3>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Fields marked with * are required</li>
            <li>Upload a main product image first (this will be the primary display image)</li>
            <li>You can add additional images separately (up to 10 total)</li>
            <li>Add multiple colors, sizes, tags, and features using the Add buttons</li>
            <li>Specifications are key-value pairs for detailed product information</li>
            <li>Click "Create Product" to save the product to your database</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;