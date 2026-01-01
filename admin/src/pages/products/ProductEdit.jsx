// src/pages/products/ProductEdit.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  FaBox,
  FaArrowLeft,
  FaImage,
  FaTag,
  FaLayerGroup,
  FaDollarSign,
  FaPercent,
  FaPalette,
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
  FaEye,
  FaFileImage,
} from "react-icons/fa";
import { useProducts } from "../../context/ProductContext";
import { getIconComponent } from "../../services/icons";
import { formatCurrency } from "../../utils/formatCurrency";
const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, deleteProduct, updateProduct, fetchProductById } = useProducts();
  // Categories based on your model
  const categories = [
    { value: "shoes", label: "👟 Shoes" },
    { value: "clothing", label: "👕 Clothing" },
    { value: "electronics", label: "💻 Electronics" },
    { value: "accessories", label: "🕶️ Accessories" },
    { value: "home", label: "🏠 Home" },
    { value: "mobile", label: "📱 Mobile" },
    { value: "beauty", label: "💄 Beauty" },
    { value: "sports", label: "⚽ Sports" },
    { value: "books", label: "📚 Books" },
    { value: "fashion", label: "👗 Fashion" },
  ];
  // Common subcategories for each category
  const subcategories = {
    shoes: ["Running", "Casual", "Sports", "Formal", "Sneakers"],
    clothing: ["T-Shirts", "Shirts", "Pants", "Jackets", "Dresses"],
    electronics: ["TVs", "Audio", "Computers", "Gaming", "Smart Home"],
    accessories: ["Watches", "Bags", "Jewelry", "Sunglasses", "Belts"],
    home: ["Furniture", "Decor", "Kitchen", "Bedding", "Lighting"],
    mobile: ["Smartphones", "Tablets", "Wearables", "Accessories"],
    beauty: ["Skincare", "Makeup", "Haircare", "Fragrance"],
    sports: ["Equipment", "Apparel", "Footwear", "Accessories"],
    books: ["Fiction", "Non-Fiction", "Educational", "Children"],
    fashion: ["Women", "Men", "Kids", "Unisex"],
  };
  // Common sizes
  const commonSizes = {
    clothing: ["XS", "S", "M", "L", "XL", "XXL"],
    shoes: ["7", "8", "9", "10", "11", "12"],
    default: ["One Size"],
  };
  // Common colors
  const commonColors = [
    { name: "Black", hex: "#000000", value: "black" },
    { name: "White", hex: "#FFFFFF", value: "white" },
    { name: "Red", hex: "#DC2626", value: "red" },
    { name: "Blue", hex: "#2563EB", value: "blue" },
    { name: "Green", hex: "#059669", value: "green" },
    { name: "Yellow", hex: "#D97706", value: "yellow" },
    { name: "Purple", hex: "#7C3AED", value: "purple" },
    { name: "Gray", hex: "#6B7280", value: "gray" },
    { name: "Brown", hex: "#92400E", value: "brown" },
    { name: "Pink", hex: "#DB2777", value: "pink" },
  ];
  // Product state
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    description: "",
    shortDescription: "",
    // Pricing
    price: "",
    originalPrice: "",
    discount: "",
    // Categorization
    category: "",
    subcategory: "",
    brand: "",
    // Images (will be stored as URLs from backend)
    mainImage: "",
    images: [],
    // Variants
    colors: [],
    sizes: [],
    // Details
    tags: [],
    features: [],
    specs: [{ key: "", value: "" }],
    // Stock & Status
    stock: "",
    inStock: true,
    isFeatured: false,
    status: "active",
    // Ratings (readonly)
    rating: 0,
    reviewCount: 0,
  });
  // File state for uploads
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImagesFiles, setAdditionalImagesFiles] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [removedImages, setRemovedImages] = useState([]);
  // Form errors
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  // Activity logs
  const [activityLogs, setActivityLogs] = useState([]);
  // Temporary states for tags and features
  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  // Load product data
  useEffect(() => {
    loadProductData();
    loadActivityLogs();
  }, [id]);
  // Load product data function
  const loadProductData = async () => {
    setIsLoading(true);
    try {
      let foundProduct = products.find((p) => p._id === id);
      if (!foundProduct) {
        // attempt to fetch from backend if not present in context
        const fetched = await fetchProductById(id);
        if (fetched && fetched.success && fetched.data) {
          foundProduct = fetched.data;
        }
      }

      if (foundProduct) {
        setProduct(foundProduct);
        // Convert specs object to array for form
        const specsArray =
          foundProduct.specs && typeof foundProduct.specs === "object"
            ? Object.entries(foundProduct.specs).map(([key, value]) => ({
                key,
                value: String(value),
              }))
            : [{ key: "", value: "" }];
        // Set form data
        setFormData({
          name: foundProduct.name || "",
          description: foundProduct.description || "",
          shortDescription: foundProduct.shortDescription || "",
          price: foundProduct.price?.toString() || "0",
          originalPrice: foundProduct.originalPrice?.toString() || "",
          discount: foundProduct.discount?.toString() || "0",
          category: foundProduct.category || "",
          subcategory: foundProduct.subcategory || "",
          brand: foundProduct.brand || "",
          mainImage: foundProduct.mainImage || "",
          images: foundProduct.images || [],
          colors: foundProduct.colors || [],
          sizes: foundProduct.sizes || [],
          tags: foundProduct.tags || [],
          features: foundProduct.features || [],
          specs: specsArray,
          stock: foundProduct.stock?.toString() || "0",
          inStock: foundProduct.inStock !== false,
          isFeatured: foundProduct.isFeatured || false,
          status: foundProduct.status || "active",
          rating: foundProduct.rating || 0,
          reviewCount: foundProduct.reviewCount || 0,
        });
      } else {
        console.error(`Product with ID ${id} not found in context or backend`);
        toast.error("Product not found");
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product data");
    } finally {
      setIsLoading(false);
    }
  };
  // Load activity logs
  const loadActivityLogs = async () => {
    // Mock activity logs
    const mockLogs = [
      {
        id: 1,
        action: "Product Created",
        timestamp: "2024-01-10T10:30:00Z",
        details: "Added to catalog",
      },
      {
        id: 2,
        action: "Price Updated",
        timestamp: "2024-01-12T14:20:00Z",
        details: "Price changed from KES 149.99 to KES 129.99",
      },
      {
        id: 3,
        action: "Stock Updated",
        timestamp: "2024-01-13T09:45:00Z",
        details: "Stock increased by 50 units",
      },
      {
        id: 4,
        action: "Featured Status",
        timestamp: "2024-01-14T11:30:00Z",
        details: "Marked as featured product",
      },
      {
        id: 5,
        action: "Review Added",
        timestamp: "2024-01-15T08:30:00Z",
        details: "New 5-star review from user123",
      },
    ];
    setActivityLogs(mockLogs);
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Auto-calculate discount if both prices are provided
    if (name === "price" || name === "originalPrice") {
      const price = parseFloat(formData.price) || 0;
      const originalPrice = parseFloat(formData.originalPrice) || 0;
      if (originalPrice > 0 && price > 0) {
        const discount = (
          ((originalPrice - price) / originalPrice) *
          100
        ).toFixed(1);
        setFormData((prev) => ({
          ...prev,
          discount: discount > 0 ? discount : "0",
        }));
      }
    }
    // Auto-calculate price if discount is provided
    if (name === "discount" && formData.originalPrice) {
      const originalPrice = parseFloat(formData.originalPrice);
      const discount = parseFloat(value) || 0;
      if (originalPrice > 0 && discount >= 0 && discount <= 100) {
        const price = originalPrice * (1 - discount / 100);
        setFormData((prev) => ({ ...prev, price: price.toFixed(2) }));
      }
    }
  };
  // Handle array fields
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };
  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };
  const handleAddFeature = () => {
    if (
      featureInput.trim() &&
      !formData.features.includes(featureInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };
  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };
  // Handle colors
  const handleColorToggle = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.find((c) => c.value === color.value)
        ? prev.colors.filter((c) => c.value !== color.value)
        : [...prev.colors, color],
    }));
  };
  // Handle sizes
  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };
  // Handle specs
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specs: newSpecs }));
  };
  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: "", value: "" }],
    }));
  };
  const handleRemoveSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };
  // Handle main image upload
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Main image file size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setMainImageFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        mainImage: previewUrl,
      }));

      // Clear main image validation error
      if (errors.mainImage) {
        setErrors((prev) => ({ ...prev, mainImage: "" }));
      }
    }
  };
  // Handle additional images upload
  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB limit`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} is not an image`);
        return false;
      }
      return true;
    });
    if (validFiles.length > 0) {
      const newFiles = [...additionalImagesFiles, ...validFiles];
      setAdditionalImagesFiles(newFiles);
      // Create preview URLs
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newPreviews],
      }));
    }
  };
  // Remove additional image
  const handleRemoveAdditionalImage = (index, isExistingImage = false) => {
    if (isExistingImage) {
      // Mark existing image for removal
      const imageUrl = formData.images[index];
      setRemovedImages((prev) => [...prev, imageUrl]);
    } else {
      // Remove uploaded file that hasn't been saved yet
      const newFiles = [...additionalImagesFiles];
      newFiles.splice(
        index - formData.images.length + additionalImagesFiles.length,
        1
      );
      setAdditionalImagesFiles(newFiles);
    }
    // Remove from preview
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory)
      newErrors.subcategory = "Subcategory is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.mainImage && !mainImageFile)
      newErrors.mainImage = "Main image is required";
    if (!formData.stock && formData.stock !== 0)
      newErrors.stock = "Stock quantity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Prepare form data for submission
  const prepareFormData = () => {
    const formDataToSend = new FormData();

    // Append product data as JSON string
    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      shortDescription: formData.shortDescription.trim(),
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : parseFloat(formData.price),
      discount: formData.discount ? parseFloat(formData.discount) : 0,
      category: formData.category.toLowerCase(),
      subcategory: formData.subcategory.toLowerCase(),
      brand: formData.brand.trim(),
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
      removedImages: removedImages,
    };

    formDataToSend.append("productData", JSON.stringify(productData));

    // Append main image file if uploaded
    if (mainImageFile) {
      formDataToSend.append("mainImage", mainImageFile);
    }

    // Append additional images files
    additionalImagesFiles.forEach((file, index) => {
      formDataToSend.append("images", file);
    });

    return formDataToSend;
  };
  // Handle form submission with confirmation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // Show confirmation dialog
    setPendingFormData(formData);
    setShowConfirmDialog(true);
  };
  // Confirm and submit
  const confirmSubmit = async () => {
    setIsSaving(true);
    setShowConfirmDialog(false);
    try {
      const formDataToSend = prepareFormData();

      // Call the update product function
      const result = await updateProduct(id, formDataToSend);

      if (result.success) {
        // Update local state
        setProduct((prev) => ({
          ...prev,
          ...result.data,
          _id: id,
        }));
        // Add activity log
        const newLog = {
          id: activityLogs.length + 1,
          action: "Product Updated",
          timestamp: new Date().toISOString(),
          details: "Product information was updated",
        };
        setActivityLogs((prev) => [newLog, ...prev]);
        // Navigate after successful update
        setTimeout(() => {
          navigate("/products");
        }, 1500);
      } else {
        throw new Error(result.error || "Failed to update product");
      }
    } catch (error) {
      let errorMessage = "Failed to update product. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsSaving(false);
      setPendingFormData(null);
    }
  };
  // Cancel confirmation
  const cancelSubmit = () => {
    setShowConfirmDialog(false);
    setPendingFormData(null);
  };
  // Handle delete product
  const handleDeleteProduct = () => {
    setShowDeleteModal(true);
  };
  // Confirm delete
  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteProduct(id);
      navigate("/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      setIsDeleting(false); // allow retry
    }
  };

  // Format currency 
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Get available sizes based on category
  const getAvailableSizes = () => {
    if (formData.category && commonSizes[formData.category]) {
      return commonSizes[formData.category];
    }
    return commonSizes.default;
  };
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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading product data..." />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }
  return (
    <>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaInfoCircle className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Confirm Changes
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to save these changes to the product? This
                will update the product information in the database.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={cancelSubmit}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-start justify-center z-50 p-4 pt-9">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDeleting ? "bg-red-200" : "bg-red-100"
                  }`}
                >
                  <FaTrash
                    className={`${
                      isDeleting ? "text-red-700" : "text-red-600"
                    }`}
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {isDeleting ? "Deleting Product..." : "Confirm Deletion"}
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                {isDeleting
                  ? "Please wait while the product is being permanently deleted."
                  : "Are you sure you want to delete this product? This action cannot be undone."}
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <span>Deleting</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <button
                  onClick={() => navigate("/products")}
                  className="p-2 rounded-full hover:bg-blue-600 transition-colors"
                  disabled={isSaving}
                >
                  <FaArrowLeft />
                </button>
                <h2 className="text-2xl font-bold">Edit Product</h2>
              </div>
              <p className="text-blue-100">
                Update product details and settings
              </p>
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
        {/* Error Messages */}
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
                <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-gray-500">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaShoppingCart className="text-gray-400" />
                      <span className="text-gray-600">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status === "active" ? "Active" : "Inactive"}
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
                      {React.createElement(getIconComponent(getCategoryIcon(product.category)), {
                        className: "text-lg text-blue-500",
                      })}
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
                        errors.name ? "border-red-300" : "border-gray-300"
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
                        errors.brand ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter brand name"
                    />
                    {errors.brand && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.brand}
                      </p>
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
                        errors.description
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Detailed product description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
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
                          errors.price ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Selling price"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.price}
                      </p>
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
                        Discount:{" "}
                        {(
                          ((parseFloat(formData.originalPrice) -
                            parseFloat(formData.price)) /
                            parseFloat(formData.originalPrice)) *
                          100
                        ).toFixed(1)}
                        %
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
                        errors.category ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.category}
                      </p>
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
                        errors.subcategory
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Subcategory</option>
                      {formData.category &&
                        subcategories[formData.category]?.map((sub) => (
                          <option key={sub} value={sub.toLowerCase()}>
                            {sub}
                          </option>
                        ))}
                    </select>
                    {errors.subcategory && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subcategory}
                      </p>
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
                  {/* Main Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image *
                    </label>
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                      <div className="relative w-full lg:w-auto">
                        <input
                          type="file"
                          id="mainImageUpload"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="mainImageUpload"
                          className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <FaUpload className="text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            {mainImageFile
                              ? "Change Main Image"
                              : "Upload Main Image"}
                          </span>
                        </label>
                        <p className="mt-2 text-xs text-gray-500">
                          Recommended: Square image, 1000x1000px, max 5MB
                        </p>
                      </div>

                      {formData.mainImage && (
                        <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border">
                          <img
                            src={formData.mainImage}
                            alt="Main Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {errors.mainImage && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mainImage}
                      </p>
                    )}
                  </div>
                  {/* Additional Images */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Additional Images (Optional)
                      </label>
                      <span className="text-sm text-gray-500">
                        {formData.images.length} images
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Upload Button */}
                      <div>
                        <input
                          type="file"
                          id="additionalImagesUpload"
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImagesUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="additionalImagesUpload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <FaFileImage className="text-gray-400 text-2xl mb-2" />
                          <span className="text-sm text-gray-600">
                            Add Images
                          </span>
                        </label>
                      </div>

                      {/* Image Previews */}
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveAdditionalImage(
                                index,
                                !image.startsWith("blob:")
                              )
                            }
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      You can upload up to 10 additional images, max 5MB each
                    </p>
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
                            formData.colors.find((c) => c.value === color.value)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-full mb-2 border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs font-medium text-gray-700">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    {formData.colors.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Selected Colors:
                        </p>
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
                              <span className="text-sm text-gray-700">
                                {color.name}
                              </span>
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
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-300 text-gray-700 hover:border-blue-300"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {formData.sizes.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Selected Sizes:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {formData.sizes.map((size, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full"
                              >
                                <span className="text-sm text-gray-700">
                                  {size}
                                </span>
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
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddTag())
                        }
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
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddFeature())
                        }
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
                              <span className="text-sm text-gray-700">
                                {feature}
                              </span>
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
                        onChange={(e) =>
                          handleSpecChange(index, "key", e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Specification name"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) =>
                          handleSpecChange(index, "value", e.target.value)
                        }
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
                        errors.stock ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter stock quantity"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.stock}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      In Stock
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, inStock: true }))
                        }
                        className={`px-4 py-2 rounded-lg border ${
                          formData.inStock
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 text-gray-700"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, inStock: false }))
                        }
                        className={`px-4 py-2 rounded-lg border ${
                          !formData.inStock
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-gray-300 text-gray-700"
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
                      <label
                        htmlFor="isFeatured"
                        className="flex items-center space-x-2"
                      >
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
                    onClick={() => navigate("/products")}
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
                  onClick={() => window.open(`/products/${id}`, "_blank")}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
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
              <h4 className="font-semibold text-gray-800 mb-4">
                Product Statistics
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(parseFloat(formData.price))}
                  </p>
                  {formData.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatCurrency(parseFloat(formData.originalPrice))}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Discount</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formData.discount}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inventory Value</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                      parseFloat(formData.price) * parseInt(formData.stock)
                    )}
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
                              ? "text-yellow-400"
                              : i < formData.rating
                              ? "text-yellow-300"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-800">
                      {formData.rating}
                    </span>
                    <span className="text-gray-500">
                      ({formData.reviewCount})
                    </span>
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
                  <div
                    key={log.id}
                    className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {log.action}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {log.details}
                        </p>
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
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Editing Notes
                  </h4>
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
    </>
  );
};
export default ProductEdit;
