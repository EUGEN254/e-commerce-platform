// src/pages/products/ProductsList.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaBox,
  FaStar,
  FaTimes,
  FaCheck,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFire,
  FaChartLine,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency";
import { useProducts } from "../../context/ProductContext";
import { getIconComponent } from "../../services/icons";

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemCount,
  isBulkDelete,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 p-4 ">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                  {isBulkDelete && itemCount > 0 && (
                    <div className="mt-2 p-3 bg-red-50 rounded-md">
                      <p className="text-sm font-medium text-red-800">
                        This action will delete {itemCount} product
                        {itemCount > 1 ? "s" : ""} permanently.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsList = () => {
  const {
    products,
    loading,
    fetchProducts,
    deleteProduct,
    updateStatus,
    toggleFeatured,
    bulkDelete,
    pagination,
    categories,
  } = useProducts();

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStock, setSelectedStock] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    isBulkDelete: false,
  });

  // Make sure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Get unique category names from context categories
  const safeCategories = useMemo(() => {
    const categoryNames = categories
      .map((cat) => cat?.name?.toLowerCase()) // Normalize to lowercase
      .filter(Boolean)
      .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates
    
    return ["all", ...categoryNames];
  }, [categories]);

  // Apply filters locally
  const filteredProducts = safeProducts
    .filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || product.status === selectedStatus;

      const matchesStock =
        selectedStock === "all" ||
        (selectedStock === "inStock" && product.inStock) ||
        (selectedStock === "outOfStock" && !product.inStock) ||
        (selectedStock === "lowStock" &&
          product.stock > 0 &&
          product.stock < 10);

      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Handle product selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((product) => product._id));
    }
  };

  // Show delete confirmation modal
  const showDeleteModal = (productId = null) => {
    setDeleteModal({
      isOpen: true,
      productId,
      isBulkDelete: productId === null,
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    const { productId, isBulkDelete } = deleteModal;

    try {
      setIsDeleting(true);
      
      if (isBulkDelete) {
        await bulkDelete(selectedProducts);
        setSelectedProducts([]);
      } else {
        await deleteProduct(productId);
        setSelectedProducts((prev) => prev.filter((id) => id !== productId));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, productId: null, isBulkDelete: false });
    }
  };

  // Handle product actions
  const handleDeleteProduct = async (productId) => {
    showDeleteModal(productId);
  };

  const handleToggleFeatured = async (productId) => {
    await toggleFeatured(productId);
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await updateStatus(productId, newStatus);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.length > 0) {
      showDeleteModal();
    }
  };

  // Handle bulk featured toggle
  const handleBulkFeaturedToggle = async () => {
    for (const id of selectedProducts) {
      await toggleFeatured(id);
    }
    setSelectedProducts([]);
  };

  // Apply filters to API
  const applyFilters = useCallback(() => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    
    if (selectedCategory !== "all") {
      // Send category name to API (products store category as names)
      filters.category = selectedCategory;
    }
    
    if (selectedStatus !== "all") filters.status = selectedStatus;
    if (selectedStock !== "all") filters.stock = selectedStock;
    if (sortField)
      filters.sort = `${sortDirection === "desc" ? "-" : ""}${sortField}`;

    console.log("Sending filters to API:", filters);
    fetchProducts(filters);
  }, [
    searchTerm,
    selectedCategory,
    selectedStatus,
    selectedStock,
    sortField,
    sortDirection,
    fetchProducts,
  ]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Build filters directly to avoid depending on applyFilters identity
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory !== "all") filters.category = selectedCategory;
      if (selectedStatus !== "all") filters.status = selectedStatus;
      if (selectedStock !== "all") filters.stock = selectedStock;
      if (sortField)
        filters.sort = `${sortDirection === "desc" ? "-" : ""}${sortField}`;

      fetchProducts(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle category change - also trigger API filter
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    
    // Apply filters immediately when category changes
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (newCategory !== "all") filters.category = newCategory;
    if (selectedStatus !== "all") filters.status = selectedStatus;
    if (selectedStock !== "all") filters.stock = selectedStock;
    if (sortField)
      filters.sort = `${sortDirection === "desc" ? "-" : ""}${sortField}`;
    
    fetchProducts(filters);
  };

  // Handle sort
  const handleSort = (field) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    applyFilters();
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field)
      return <FaSort className="text-gray-400 text-xs" />;
    return sortDirection === "asc" ? (
      <FaSortUp className="text-blue-500" />
    ) : (
      <FaSortDown className="text-blue-500" />
    );
  };


  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get category icon
  // Get category icon from utility
  const getCategoryIcon = (category) => {
    const iconMap = {
      shoes: "FaShoePrints",
      electronics: "FaLaptop",
      clothing: "FaTshirt",
      mobile: "FaMobileAlt",
      accessories: "FaShoppingBag",
      home: "FaHome",
      beauty: "GiLipstick",
      sports: "GiWeightLiftingUp",
      books: "FaBook",
      fashion: "GiLargeDress",
    };
    
    return iconMap[category] || "FaBox";
  };

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + (p.price || 0) * (p.stock || 0),
    0
  );
  const lowStockProducts = products.filter(
    (p) => p.stock > 0 && p.stock < 10
  ).length;
  const outOfStockProducts = products.filter((p) => !p.inStock).length;
  const featuredProducts = products.filter((p) => p.isFeatured).length;

  // Modal configuration
  const modalConfig = deleteModal.isBulkDelete
    ? {
        title: "Delete Multiple Products",
        message:
          "Are you sure you want to delete the selected products? This action cannot be undone.",
        itemCount: selectedProducts.length,
      }
    : {
        title: "Delete Product",
        message:
          "Are you sure you want to delete this product? This action cannot be undone.",
        itemCount: 1,
      };

  // Combined loading state - only show table spinner for initial load, not for deletions
  const showTableSpinner = loading && !isDeleting;

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            productId: null,
            isBulkDelete: false,
          })
        }
        onConfirm={handleDeleteConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        itemCount={modalConfig.itemCount}
        isBulkDelete={deleteModal.isBulkDelete}
        isLoading={isDeleting}
      />

      {/* Header with Stats */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Product Management</h2>
            <p className="text-blue-100">
              Manage your product catalog, inventory, and pricing
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center lg:space-x-6 gap-4 lg:gap-6">
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Products</p>
              <p className="text-xl lg:text-2xl font-bold">
                {pagination.total || totalProducts}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Value</p>
              <p className="text-xl lg:text-2xl font-bold">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Featured</p>
              <p className="text-xl lg:text-2xl font-bold">
                {featuredProducts}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Low Stock</p>
              <p className="text-xl lg:text-2xl font-bold">
                {lowStockProducts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="pl-3 pr-8 py-2 w-full sm:w-48 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-colors"
              >
                <option value="all">All Categories</option>
                {safeCategories
                  .filter((c) => c !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative w-full sm:w-auto">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setSelectedStatus(newStatus);
                  
                  // Apply filters immediately
                  const filters = {};
                  if (searchTerm) filters.search = searchTerm;
                  if (selectedCategory !== "all") filters.category = selectedCategory;
                  if (newStatus !== "all") filters.status = newStatus;
                  if (selectedStock !== "all") filters.stock = selectedStock;
                  if (sortField)
                    filters.sort = `${sortDirection === "desc" ? "-" : ""}${sortField}`;
                  
                  fetchProducts(filters);
                }}
                className="pl-10 pr-8 py-2 w-full sm:w-40 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div className="relative w-full sm:w-auto">
              <FaBox className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedStock}
                onChange={(e) => {
                  const newStock = e.target.value;
                  setSelectedStock(newStock);
                  
                  // Apply filters immediately
                  const filters = {};
                  if (searchTerm) filters.search = searchTerm;
                  if (selectedCategory !== "all") filters.category = selectedCategory;
                  if (selectedStatus !== "all") filters.status = selectedStatus;
                  if (newStock !== "all") filters.stock = newStock;
                  if (sortField)
                    filters.sort = `${sortDirection === "desc" ? "-" : ""}${sortField}`;
                  
                  fetchProducts(filters);
                }}
                className="pl-10 pr-8 py-2 w-full sm:w-44 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-colors"
              >
                <option value="all">All Stock</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
                <option value="lowStock">Low Stock</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {selectedProducts.length} selected
                </span>
                <button
                  onClick={handleBulkFeaturedToggle}
                  disabled={loading || isDeleting}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 hover:text-yellow-800 transition-colors disabled:opacity-50 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Toggle Featured
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={loading || isDeleting || selectedProducts.length === 0}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 hover:text-red-800 transition-colors disabled:opacity-50 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete Selected
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Link
                to="/products/create"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaPlus />
                <span>Add Product</span>
              </Link>

              <button
                onClick={applyFilters}
                disabled={loading || isDeleting}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <FaDownload />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Total Products</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">
                {pagination.total || totalProducts}
              </h3>
            </div>
            <div className="shrink-0 p-3 bg-blue-100 rounded-full ml-3">
              <FaBox className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Inventory Value</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">
                {formatCurrency(totalValue)}
              </h3>
            </div>
            <div className="shrink-0 p-3 bg-green-100 rounded-full ml-3">
              <FaChartLine className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">Low Stock</p>
              <h3 className="text-xl font-bold text-red-600 mt-1">
                {lowStockProducts}
              </h3>
            </div>
            <div className="shrink-0 p-3 bg-red-100 rounded-full ml-3">
              <FaTimes className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">
                Featured Products
              </p>
              <h3 className="text-xl font-bold text-purple-600 mt-1">
                {featuredProducts}
              </h3>
            </div>
            <div className="shrink-0 p-3 bg-purple-100 rounded-full ml-3">
              <FaFire className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {showTableSpinner ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left w-12">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedProducts.length ===
                              filteredProducts.length &&
                            filteredProducts.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
                          disabled={filteredProducts.length === 0 || isDeleting}
                        />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Product</span>
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Category</span>
                        {getSortIcon("category")}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Price</span>
                        {getSortIcon("price")}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                      onClick={() => handleSort("stock")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Stock</span>
                        {getSortIcon("stock")}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                      onClick={() => handleSort("rating")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Rating</span>
                        {getSortIcon("rating")}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Added</span>
                        {getSortIcon("createdAt")}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => handleSelectProduct(product._id)}
                            className="rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
                            disabled={isDeleting}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={
                                  product.mainImage ||
                                  "https://via.placeholder.com/150"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/150";
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-800 truncate">
                                {product.name}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500 truncate">
                                  {product.brand}
                                </span>
                                {product.isFeatured && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded shrink-0">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {React.createElement(getIconComponent(getCategoryIcon(product.category)), {
                              className: "text-lg text-blue-500",
                            })}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 capitalize truncate">
                                {product.category || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {product.subcategory || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 truncate">
                              {formatCurrency(product.price)}
                            </p>
                            {product.discount > 0 && (
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-500 line-through truncate">
                                  {formatCurrency(product.originalPrice)}
                                </span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded shrink-0">
                                  -{product.discount}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium truncate ${
                              product.stock === 0
                                ? "bg-red-100 text-red-800"
                                : product.stock < 10
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.stock === 0
                              ? "Out of Stock"
                              : `${product.stock} units`}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 shrink-0" />
                              <span className="ml-1 font-medium">
                                {product.rating || 0}
                              </span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600 truncate">
                              ({product.reviewCount || 0})
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600 truncate">
                            {formatDate(product.createdAt)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleToggleStatus(product._id, product.status)
                              }
                              disabled={loading || isDeleting}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full disabled:opacity-50 shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                product.status === "active"
                                  ? "bg-green-500 focus:ring-green-500"
                                  : "bg-gray-300 focus:ring-gray-500"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  product.status === "active"
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span
                              className={`text-sm font-medium truncate ${
                                product.status === "active"
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {product.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleFeatured(product._id)}
                              disabled={loading || isDeleting}
                              className={`p-2 rounded disabled:opacity-50 shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                product.isFeatured
                                  ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-700 focus:ring-yellow-500"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 focus:ring-gray-500"
                              }`}
                              title={
                                product.isFeatured
                                  ? "Remove from Featured"
                                  : "Mark as Featured"
                              }
                            >
                              <FaFire />
                            </button>

                            <Link
                              to={`/products/${product._id}/edit`}
                              className="p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                              title="Edit Product"
                            >
                              <FaEdit />
                            </Link>

                            <Link
                              to={`/products/${product._id}`}
                              className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 shrink-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </Link>

                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={loading || isDeleting}
                              className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 disabled:opacity-50 shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                              title="Delete Product"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <FaBox className="text-4xl text-gray-300" />
                          <p>No products found</p>
                          {searchTerm || selectedCategory !== "all" || selectedStatus !== "all" || selectedStock !== "all" ? (
                            <p className="text-sm">
                              Try adjusting your search or filters
                            </p>
                          ) : null}
                          <Link
                            to="/products/create"
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <FaPlus />
                            <span>Add Your First Product</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm text-gray-600">
                  Showing {filteredProducts.length} of {pagination.total}{" "}
                  products
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchProducts({ page: pagination.page - 1 })}
                    disabled={pagination.page === 1 || loading || isDeleting}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchProducts({ page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages || loading || isDeleting}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsList;