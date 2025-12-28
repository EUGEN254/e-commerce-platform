// src/pages/products/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { toast } from 'sonner';
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaTag,
  FaPalette,
  FaRuler,
  FaList,
  FaCheck,
  FaTimes,
  FaBox,
  FaStar,
  FaFire,
  FaShoppingCart,
  FaDollarSign,
  FaPercent,
  FaLayerGroup,
  FaCalendar,
  FaEye,
  FaTruck,
  FaWarehouse,
  FaChartLine,
  FaShareAlt,
  FaPrint,
  FaSpinner
} from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, fetchProductById, deleteProduct } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
        navigate('/products');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const mainImage = product.mainImage || (product.images && product.images[0]) || 'https://via.placeholder.com/600';
  const additionalImages = product.images || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={() => navigate('/products')}
                className="p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              {product.isFeatured && (
                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm">
                  <FaFire className="text-xs" />
                  <span>Featured</span>
                </span>
              )}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.status === 'active' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {product.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCategoryIcon(product.category)}</span>
                <span className="capitalize">{product.category} • {product.subcategory}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaBox />
                <span>SKU: {product._id?.slice(-8) || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendar />
                <span>Added: {formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <FaShareAlt />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <FaPrint />
              <span>Print</span>
            </button>
            <Link
              to={`/products/${id}/edit`}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <FaEdit />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-96">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600';
                }}
              />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                  -{product.discount}%
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          {additionalImages.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Additional Images</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {additionalImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-1 px-6">
                {['overview', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                  <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                  
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Key Features</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  {product.specs && Object.keys(product.specs).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-gray-600 capitalize">{key}</span>
                          <span className="font-medium text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No specifications available</p>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-800">{product.rating || 0}</div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`w-5 h-5 ${
                                star <= (product.rating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Based on {product.reviewCount || 0} reviews
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Add Review
                    </button>
                  </div>
                  <p className="text-gray-500 italic text-center py-8">
                    Review functionality will be implemented soon
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Info & Actions */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selling Price</span>
                <span className="text-2xl font-bold text-gray-800">
                  {formatCurrency(product.price)}
                </span>
              </div>
              
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Original Price</span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                </div>
              )}
              
              {product.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-lg font-medium text-green-600">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profit Margin</span>
                  <span className="text-lg font-medium text-green-600">
                    {product.originalPrice && product.originalPrice > 0
                      ? `${(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Stock Quantity</span>
                <span className={`text-xl font-bold ${
                  product.stock === 0
                    ? 'text-red-600'
                    : product.stock < 10
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {product.stock || 0} units
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    product.inStock ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Inventory Value</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency((product.price || 0) * (product.stock || 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Variants</h3>
            <div className="space-y-4">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaPalette className="text-gray-400" />
                    <span className="text-gray-600">Colors</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full"
                        title={color.name}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex || '#ccc' }}
                        />
                        <span className="text-sm text-gray-700">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaRuler className="text-gray-400" />
                    <span className="text-gray-600">Sizes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaTag className="text-gray-400" />
                    <span className="text-gray-600">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaEye />
                <span>Preview Product</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <FaShoppingCart />
                <span>Create Order</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <FaChartLine />
                <span>View Analytics</span>
              </button>
              <Link
                to={`/products/${id}/edit`}
                className="block w-full text-center px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Edit Product Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Views</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">N/A</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaEye className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Orders</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">N/A</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaShoppingCart className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">N/A</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaDollarSign className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">N/A</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaChartLine className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;