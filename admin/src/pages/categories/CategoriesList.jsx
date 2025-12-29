// src/pages/categories/CategoriesList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaTags,
  FaStar,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaImage,
  FaList,
  FaInfoCircle,
  FaLayerGroup,
  FaCheck,
  FaTimes,
  FaArrowsAltV,
  FaFolder,
  FaFolderOpen,
  FaTag,
  FaChartBar,
} from "react-icons/fa";
import { toast } from "sonner";
import { useProducts } from "../../context/ProductContext";
import { getIconComponent } from "../../services/icons";

const CategoriesList = () => {
  // Get all necessary functions and state from ProductContext
  const {
    categories,
    stats,
    fetchCategories,
    updateCategoryStatus,
    updateCategoryFeatured,
    deleteCategory,
    bulkUpdateCategories,
    bulkDeleteCategories,
    updateCategoryOrder,
    categoriesLoading,
    fetchProductsCountForCategories,
  } = useProducts();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortField, setSortField] = useState("order");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Fetch categories and stats on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch basic categories first
        await fetchCategories();

        // Then fetch product counts for all categories
        await fetchProductsCountForCategories();
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load categories");
      }
    };

    loadData();
  }, []);

  // Function to get the actual icon component
  const getCategoryIcon = (iconValue) => {
    if (!iconValue) return null;

    // Check if it's already a React component (shouldn't happen with your data)
    if (React.isValidElement(iconValue)) {
      return iconValue;
    }

    // Use your utility to get the icon component
    const IconComponent = getIconComponent(iconValue);

    // If it's an emoji or no icon found, return the string/emoji
    if (!IconComponent) {
      return <span className="text-xl">{iconValue || "📁"}</span>;
    }

    // Return the React component
    return <IconComponent className="text-xl" />;
  };

  // Extract unique types from categories
  const types = [
    "all",
    ...new Set(categories.map((c) => c.type).filter(Boolean)),
  ];

  // Filter and sort categories
  const filteredCategories = categories
    .filter((category) => {
      const matchesSearch =
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        category.id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || category.type === selectedType;

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && category.isActive) ||
        (selectedStatus === "inactive" && !category.isActive);

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get subcategories count for a category
  const getSubcategoriesCount = (category) => {
    if (
      category.subcategoriesDetailed &&
      category.subcategoriesDetailed.length > 0
    ) {
      return category.subcategoriesDetailed.length;
    }
    if (category.subcategories && category.subcategories.length > 0) {
      return category.subcategories.length;
    }
    return 0;
  };

  // Get subcategories for a category
  const getSubcategories = (category) => {
    if (
      category.subcategoriesDetailed &&
      category.subcategoriesDetailed.length > 0
    ) {
      return category.subcategoriesDetailed;
    }
    if (category.subcategories && category.subcategories.length > 0) {
      // Convert string subcategories to objects
      return category.subcategories.map((subcatName) => ({
        name: subcatName,
        description: "",
        totalProducts: 0,
      }));
    }
    return [];
  };

  // Handle category selection
  const handleSelectCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (
      selectedCategories.length === filteredCategories.length &&
      filteredCategories.length > 0
    ) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((cat) => cat._id));
    }
  };

  // Handle category actions
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Failed to delete category");
    }
  };

  const handleToggleFeatured = async (categoryId) => {
    try {
      const category = categories.find((c) => c._id === categoryId);
      if (!category) return;

      const newFeaturedStatus = !category.featured;
      await updateCategoryFeatured(categoryId, newFeaturedStatus);
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error(error.message || "Failed to update featured status");
    }
  };

  const handleToggleStatus = async (categoryId) => {
    try {
      const category = categories.find((c) => c._id === categoryId);
      if (!category) return;

      const newStatus = !category.isActive;
      await updateCategoryStatus(categoryId, newStatus);
      toast.success(
        newStatus ? "Category activated!" : "Category deactivated!"
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleReorder = async (categoryId, direction) => {
    try {
      const category = categories.find((c) => c._id === categoryId);
      if (!category) return;

      const currentOrder = category.order || 0;
      const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

      await updateCategoryOrder(categoryId, newOrder);
      await fetchCategories(); // Refresh categories list
      toast.success("Category order updated!");
    } catch (error) {
      console.error("Error reordering category:", error);
      toast.error("Failed to reorder category");
    }
  };

  // Bulk actions
  const handleBulkFeatured = async () => {
    if (selectedCategories.length === 0) return;

    try {
      const category = categories.find((c) => c._id === selectedCategories[0]);
      if (!category) return;

      const currentFeatured = category?.featured || false;
      const newFeatured = !currentFeatured;

      await bulkUpdateCategories(selectedCategories, {
        featured: newFeatured,
      });

      setSelectedCategories([]);
      toast.success(`${selectedCategories.length} categories updated!`);
    } catch (error) {
      console.error("Error bulk updating featured:", error);
      toast.error("Failed to update categories");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;

    if (!window.confirm(`Delete ${selectedCategories.length} categories?`)) {
      return;
    }

    try {
      await bulkDeleteCategories(selectedCategories);
      setSelectedCategories([]);
      toast.success(`${selectedCategories.length} categories deleted!`);
    } catch (error) {
      console.error("Error bulk deleting categories:", error);
      toast.error("Failed to delete categories");
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Toggle subcategory view
  const toggleSubcategories = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Handle export
  const handleExport = () => {
    toast.info("Export feature coming soon!");
  };

  // Loading state
  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Category Management</h2>
            <p className="text-blue-100">
              Organize your product categories and subcategories
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Categories</p>
              <p className="text-2xl font-bold">
                {stats?.totalCategories || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Products in (category)</p>
              <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Featured</p>
              <p className="text-2xl font-bold">
                {stats?.featuredCategories || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Active</p>
              <p className="text-2xl font-bold">
                {stats?.activeCategories || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Types</option>
                {types
                  .filter((t) => t !== "all")
                  .map((type) => (
                    <option key={type} value={type}>
                      {type?.charAt(0)?.toUpperCase() + type?.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaTag className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {selectedCategories.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{selectedCategories.length} selected</span>
                <button
                  onClick={handleBulkFeatured}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                >
                  Toggle Featured
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            )}

            <Link
              to="/categories/create"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              <span>Add Category</span>
            </Link>

            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaDownload />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Categories</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {stats?.totalCategories || 0}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaTags className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Categories</p>
              <h3 className="text-2xl font-bold text-green-600 mt-2">
                {stats?.activeCategories || 0}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheck className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Featured Categories</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-2">
                {stats?.featuredCategories || 0}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaStar className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Products in Categories</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-2">
                {stats?.totalProducts || 0}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaChartBar className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedCategories.length ===
                          filteredCategories.length &&
                        filteredCategories.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort("order")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Order</span>
                    {getSortIcon("order")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    {getSortIcon("type")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort("totalProducts")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Products</span>
                    {getSortIcon("totalProducts")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => {
                  const subcategoriesCount = getSubcategoriesCount(category);
                  const subcategoriesList = getSubcategories(category);

                  return (
                    <React.Fragment key={category._id}>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category._id)}
                            onChange={() => handleSelectCategory(category._id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleReorder(category._id, "up")}
                              className="p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-200 disabled:cursor-not-allowed"
                              title="Move up"
                              disabled={category.order <= 1}
                            >
                              <FaSortUp />
                            </button>
                            <span className="font-medium text-gray-800 w-6 text-center">
                              {category.order || 0}
                            </span>
                            <button
                              onClick={() =>
                                handleReorder(category._id, "down")
                              }
                              className="p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-200 disabled:cursor-not-allowed"
                              title="Move down"
                              disabled={category.order >= categories.length}
                            >
                              <FaSortDown />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {category.image ? (
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  {getCategoryIcon(category.icon)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="font-bold text-gray-800 truncate">
                                  {category.name}
                                </p>
                                {category.featured && (
                                  <FaStar className="text-yellow-400 text-sm" />
                                )}
                                {category.isMainCategory && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                    Main
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                {category.description}
                              </p>
                              <div className="flex items-center space-x-3 mt-1">
                                {subcategoriesCount > 0 && (
                                  <>
                                    <button
                                      onClick={() =>
                                        toggleSubcategories(category._id)
                                      }
                                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                    >
                                      {expandedCategory === category._id ? (
                                        <FaFolderOpen className="text-xs" />
                                      ) : (
                                        <FaFolder className="text-xs" />
                                      )}
                                      <span>
                                        {subcategoriesCount} subcategories
                                      </span>
                                    </button>
                                    <span className="text-gray-400">•</span>
                                  </>
                                )}
                                <span className="text-xs text-gray-500">
                                  ID: {category.id}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {getCategoryIcon(category.icon)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 capitalize">
                                {category.type || "Uncategorized"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {category.path || `/${category.id}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-center">
                            <p className="font-bold text-gray-800 text-lg">
                              {category.totalProducts || 0}
                            </p>
                            <p className="text-xs text-gray-500">products</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">
                            {formatDate(category.createdAt)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleStatus(category._id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                category.isActive
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  category.isActive
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span
                              className={`text-sm font-medium ${
                                category.isActive
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {category.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleFeatured(category._id)}
                              className={`p-2 rounded ${
                                category.featured
                                  ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title={
                                category.featured
                                  ? "Remove from Featured"
                                  : "Mark as Featured"
                              }
                            >
                              <FaStar />
                            </button>

                            <Link
                              to={`/categories/${category._id}/edit`}
                              className="p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                              title="Edit Category"
                            >
                              <FaEdit />
                            </Link>

                            <Link
                              to={`/categories/${category._id}`}
                              className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
                              title="View Details"
                            >
                              <FaEye />
                            </Link>

                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
                              title="Delete Category"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Subcategories Row */}
                      {expandedCategory === category._id &&
                        subcategoriesList.length > 0 && (
                          <tr className="bg-gray-50">
                            <td colSpan="8" className="py-4 px-4">
                              <div className="pl-14">
                                <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                                  <FaLayerGroup className="text-gray-400" />
                                  <span>
                                    Subcategories ({subcategoriesList.length})
                                  </span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {subcategoriesList.map((subcat, index) => (
                                    <div
                                      key={index}
                                      className="bg-white rounded-lg p-4 border border-gray-200"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-medium text-gray-800">
                                          {subcat.name}
                                        </h5>
                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                          {subcat.totalProducts || 0} products
                                        </span>
                                      </div>
                                      {subcat.description && (
                                        <p className="text-sm text-gray-600 mb-3">
                                          {subcat.description}
                                        </p>
                                      )}
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() =>
                                            toast.info(
                                              "Edit subcategory feature coming soon!"
                                            )
                                          }
                                          className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            toast.info(
                                              "Delete subcategory feature coming soon!"
                                            )
                                          }
                                          className="text-xs text-red-600 hover:text-red-800"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <Link
                                      to={`/categories/${category._id}/add-subcategory`}
                                      className="text-gray-600 hover:text-blue-600 flex items-center space-x-2"
                                    >
                                      <FaPlus />
                                      <span>Add Subcategory</span>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FaTags className="text-4xl text-gray-300" />
                      <p>No categories found</p>
                      {searchTerm && (
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      )}
                      <Link
                        to="/categories/create"
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                      >
                        <FaPlus />
                        <span>Add Your First Category</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Type Distribution Chart */}
      {types.length > 1 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Category Type Distribution
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {types
              .filter((t) => t !== "all")
              .map((type) => {
                const count = categories.filter((c) => c.type === type).length;
                const products = categories
                  .filter((c) => c.type === type)
                  .reduce((sum, cat) => sum + (cat.totalProducts || 0), 0);
                const percentage = (count / categories.length) * 100;

                return (
                  <div key={type} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      {getCategoryIcon(
                        categories.find((c) => c.type === type)?.icon
                      )}
                    </div>
                    <p className="font-medium text-gray-800 capitalize">
                      {type}
                    </p>
                    <div className="flex justify-center space-x-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Categories</p>
                        <p className="text-xl font-bold text-gray-800">
                          {count}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Products</p>
                        <p className="text-xl font-bold text-blue-600">
                          {products}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {percentage.toFixed(1)}% of total
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <FaInfoCircle className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">
              Category Management Tips
            </h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Main categories appear in the main navigation menu</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>
                  Use the order field to control category display sequence
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Featured categories are highlighted on the homepage</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Inactive categories are hidden from customers</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>
                  Subcategories help organize products within main categories
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesList;
