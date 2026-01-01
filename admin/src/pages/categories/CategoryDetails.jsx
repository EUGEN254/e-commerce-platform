// src/pages/categories/CategoryDetails.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaStar,
  FaCheck,
  FaTimes,
  FaImage,
  FaFolder,
  FaTag,
  FaList,
  FaChartBar,
  FaProductHunt,
  FaCalendarAlt,
  FaShareAlt,
  FaCopy,
  FaEye,
  FaEyeSlash,
  FaSortNumericDown,
  FaRoute,
  FaInfoCircle,
  FaLink,
  FaExternalLinkAlt,
  FaShoppingBag,
  FaBoxOpen,
  FaPlus,
  FaRegEdit,
} from "react-icons/fa";

import { toast } from "sonner";
import { getIconComponent } from "../../services/icons";
import { useProducts } from "../../context/ProductContext";
import { formatCurrency } from "../../utils/formatCurrency";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    categories,
    getCategoryById,
    updateCategoryStatus,
    deleteCategory,
    categoriesLoading,
    fetchProductsCountForCategories,
    getProductsByCategory,
  } = useProducts();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        // Get category by ID
        const categoryData = getCategoryById(id);
        if (!categoryData) {
          toast.error("Category not found");
          navigate("/categories");
          return;
        }
        setCategory(categoryData);

        // Fetch product count for this category only if it's not present
        // (avoid repeatedly refetching and triggering this effect in a loop)
        if (categoryData.totalProducts === undefined || categoryData.totalProducts === null) {
          await fetchProductsCountForCategories();
        }

        // Fetch products in this category
        setProductsLoading(true);
        const categoryProducts = await getProductsByCategory(categoryData.id);
        setProducts(categoryProducts || []);
        setProductsLoading(false);

      } catch (error) {
        console.error("Error loading category data:", error);
        toast.error("Failed to load category details");
        navigate("/categories");
      }
    };

    loadCategoryData();
  }, [id, categories]);

  // Function to get the actual icon component
  const getCategoryIcon = (iconValue) => {
    if (!iconValue) return null;

    if (React.isValidElement(iconValue)) {
      return iconValue;
    }

    const IconComponent = getIconComponent(iconValue);

    if (!IconComponent) {
      return <span className="text-xl">{iconValue || "📁"}</span>;
    }

    return <IconComponent className="text-xl" />;
  };

  // Handle status toggle
  const handleToggleStatus = async () => {
    if (!category) return;

    try {
      const newStatus = !category.isActive;
      await updateCategoryStatus(category._id, newStatus);
      
      // Update local state
      setCategory({ ...category, isActive: newStatus });
      
      toast.success(
        newStatus 
          ? "Category activated successfully!" 
          : "Category deactivated successfully!"
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update category status");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!category) return;

    if (!window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCategory(category._id);
      toast.success("Category deleted successfully!");
      navigate("/categories");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  // Copy category URL to clipboard
  const copyToClipboard = () => {
    const url = `${window.location.origin}/categories/${category.id}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        toast.success("URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error("Failed to copy URL");
      });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Get subcategories
  const getSubcategories = () => {
    if (!category) return [];
    
    if (
      category.subcategoriesDetailed &&
      category.subcategoriesDetailed.length > 0
    ) {
      return category.subcategoriesDetailed;
    }
    
    if (category.subcategories && category.subcategories.length > 0) {
      return category.subcategories.map((subcatName) => ({
        name: subcatName,
        description: "",
        totalProducts: 0,
      }));
    }
    
    return [];
  };

  // Loading state
  if (categoriesLoading || !category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading category details..." />
      </div>
    );
  }

  const subcategories = getSubcategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Link
            to="/categories"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Back to Categories"
          >
            <FaArrowLeft className="text-gray-600" />
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-3xl">
                  {getCategoryIcon(category.icon)}
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {category.name}
                {category.featured && (
                  <FaStar className="text-yellow-400" title="Featured Category" />
                )}
                {category.isMainCategory && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Main Category
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                {category.description || "No description provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            category.isActive 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {category.isActive ? "Active" : "Inactive"}
          </div>
          
          <button
            onClick={copyToClipboard}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              copied 
                ? "bg-green-100 text-green-700" 
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
            title="Copy Category URL"
          >
            {copied ? <FaCheck /> : <FaCopy />}
            <span>{copied ? "Copied!" : "Copy URL"}</span>
          </button>
          
          <Link
            to={`/categories/${id}/edit`}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaEdit />
            <span>Edit</span>
          </Link>
          
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {category.totalProducts || 0}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaProductHunt className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Subcategories</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-2">
                {subcategories.length}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaFolder className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Display Order</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-2">
                #{category.order || 0}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaSortNumericDown className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Status</p>
              <h3 className="text-2xl font-bold mt-2">
                <button
                  onClick={handleToggleStatus}
                  className={`flex items-center space-x-2 ${
                    category.isActive 
                      ? "text-green-600 hover:text-green-700" 
                      : "text-red-600 hover:text-red-700"
                  }`}
                >
                  {category.isActive ? <FaCheck /> : <FaTimes />}
                  <span>{category.isActive ? "Active" : "Inactive"}</span>
                </button>
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              category.isActive ? "bg-green-100" : "bg-red-100"
            }`}>
              {category.isActive ? (
                <FaCheck className="text-green-600 text-2xl" />
              ) : (
                <FaTimes className="text-red-600 text-2xl" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaInfoCircle className="inline mr-2" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab("products")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "products"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaBoxOpen className="inline mr-2" />
            Products ({products.length})
          </button>
          
          <button
            onClick={() => setActiveTab("subcategories")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "subcategories"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaFolder className="inline mr-2" />
            Subcategories ({subcategories.length})
          </button>
          
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaRegEdit className="inline mr-2" />
            Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category ID:</span>
                    <span className="font-medium">{category.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{category.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Path:</span>
                    <span className="font-medium">{category.path}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Icon:</span>
                    <span className="text-2xl">{getCategoryIcon(category.icon)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Featured:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      category.featured 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {category.featured ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Category Image</p>
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaImage className="text-3xl" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Banner Image</p>
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                      {category.bannerImage ? (
                        <img
                          src={category.bannerImage}
                          alt={`${category.name} Banner`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaImage className="text-3xl" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {category.description || "No description provided for this category."}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaCalendarAlt />
                    Created
                  </span>
                  <span className="font-medium">{formatDate(category.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaRegEdit />
                    Last Updated
                  </span>
                  <span className="font-medium">{formatDate(category.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Preview Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/shop/${category.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FaExternalLinkAlt />
                  <span>View on Storefront</span>
                </a>
                
                <Link
                  to={`/categories/${id}/edit`}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  <FaEdit />
                  <span>Edit Category</span>
                </Link>
                
                <button
                  onClick={() => navigate(`/products?category=${category.id}`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <FaBoxOpen />
                  <span>View All Products</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Products in this Category</h3>
              <span className="text-gray-600">{products.length} products found</span>
            </div>

            {productsLoading ? (
              <LoadingSpinner size="sm" message="Loading products..." />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 9).map((product) => (
                  <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={product.mainImage || product.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(product.price)}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          product.inStock 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="flex-1 text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/products/${product._id}/edit`}
                          className="flex-1 text-center py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaBoxOpen className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No products found in this category</p>
                <p className="text-sm text-gray-500 mb-4">Add products to this category to see them here</p>
                <Link
                  to="/products/create"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus />
                  <span>Add New Product</span>
                </Link>
              </div>
            )}

            {products.length > 9 && (
              <div className="mt-6 text-center">
                <Link
                  to={`/products?category=${category.id}`}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaEye />
                  <span>View All {products.length} Products</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "subcategories" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Subcategories</h3>
              {subcategories.length > 0 && (
                <span className="text-gray-600">{subcategories.length} subcategories</span>
              )}
            </div>

            {subcategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategories.map((subcat, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaFolder className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{subcat.name}</h4>
                        {subcat.totalProducts > 0 && (
                          <p className="text-sm text-blue-600">
                            {subcat.totalProducts} products
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {subcat.description && (
                      <p className="text-gray-600 text-sm mb-4">{subcat.description}</p>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/categories/${category._id}/edit`, {
                            state: { editSubcategory: subcat.name },
                          })
                        }
                        className="flex-1 text-center py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/products?category=${category.id}&subcategory=${encodeURIComponent(
                              subcat.name
                            )}`
                          )
                        }
                        className="flex-1 text-center py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                      >
                        View Products
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Add Subcategory Card */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FaPlus className="text-blue-600 text-xl" />
                  </div>
                  <p className="text-gray-700 font-medium mb-2">Add Subcategory</p>
                  <p className="text-gray-500 text-sm text-center mb-4">
                    Create a new subcategory under {category.name}
                  </p>
                  <button
                    onClick={() => toast.info("Add subcategory feature coming soon!")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Add Subcategory
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaFolder className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No subcategories found</p>
                <p className="text-sm text-gray-500 mb-4">
                  Subcategories help organize products within {category.name}
                </p>
                <button
                  onClick={() => toast.info("Add subcategory feature coming soon!")}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus />
                  <span>Add First Subcategory</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Category Status</p>
                    <p className="text-sm text-gray-600">
                      {category.isActive 
                        ? "Category is visible to customers" 
                        : "Category is hidden from customers"
                      }
                    </p>
                  </div>
                  <button
                    onClick={handleToggleStatus}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      category.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        category.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Featured Category</p>
                    <p className="text-sm text-gray-600">
                      {category.featured 
                        ? "Category is highlighted on homepage" 
                        : "Category is displayed normally"
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {category.featured ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaStar className="text-gray-300" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Display Order</p>
                    <p className="text-sm text-gray-600">
                      Controls position in category lists (#{category.order || 0})
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    #{category.order || 0}
                  </span>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-red-800">Danger Zone</p>
                      <p className="text-sm text-red-600">
                        Once deleted, this category cannot be recovered
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDelete}
                    className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Category Permanently
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Path
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={category.path}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={`${window.location.origin}/categories/${category.id}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;