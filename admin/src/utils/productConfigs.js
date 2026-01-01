// src/utils/productConfigs.js
export const getProductTypeConfigs = (productType) => {
  // Size meaning mapping
  const sizeMeanings = {
    'phone': 'storage-capacity',
    'laptop': 'storage-ram',
    'tablet': 'storage',
    't-shirt': 'clothing-size',
    'shirt': 'clothing-size',
    'pants': 'clothing-size',
    'jeans': 'clothing-size',
    'shoes': 'shoe-size',
    'sneakers': 'shoe-size',
    'boots': 'shoe-size',
    'watch': 'watch-size',
    'book': 'book-type',
    'furniture': 'dimensions',
    'bag': 'bag-size',
    'jacket': 'clothing-size',
    'default': 'standard-size'
  };

  // Size descriptions
  const sizeDescriptions = {
    'phone': 'Storage capacity in GB (64GB, 128GB, 256GB)',
    'laptop': 'RAM + Storage (8GB/256GB, 16GB/512GB)',
    'tablet': 'Storage capacity (64GB, 128GB, 256GB)',
    't-shirt': 'Clothing sizes (XS, S, M, L, XL)',
    'shirt': 'Clothing sizes (XS, S, M, L, XL)',
    'pants': 'Clothing sizes (28, 30, 32, 34, 36)',
    'jeans': 'Jeans sizes (28x30, 30x32, 32x34)',
    'shoes': 'Shoe sizes (7, 8, 9, 10, 11, 12)',
    'sneakers': 'Shoe sizes (7, 8, 9, 10, 11, 12)',
    'boots': 'Shoe sizes (7, 8, 9, 10, 11, 12)',
    'watch': 'Case size (40mm, 42mm, 44mm, 46mm)',
    'book': 'Format (Paperback, Hardcover, E-book)',
    'furniture': 'Dimensions (Small, Medium, Large)',
    'bag': 'Size (Small, Medium, Large)',
    'jacket': 'Clothing sizes (XS, S, M, L, XL)',
    'default': 'Standard product variations'
  };

  // Color sets
  const colorSets = {
    'phone': [
      { name: "Midnight Black", hex: "#000000", type: "finish", value: "black" },
      { name: "Starlight White", hex: "#F5F5F7", type: "finish", value: "white" },
      { name: "Sierra Blue", hex: "#93C5FD", type: "finish", value: "blue" },
      { name: "Alpine Green", hex: "#10B981", type: "finish", value: "green" }
    ],
    'laptop': [
      { name: "Space Gray", hex: "#6B7280", type: "finish", value: "gray" },
      { name: "Silver", hex: "#D1D5DB", type: "finish", value: "silver" },
      { name: "Midnight", hex: "#1F2937", type: "finish", value: "dark-blue" }
    ],
    't-shirt': [
      { name: "Navy Blue", hex: "#1E3A8A", type: "fabric", value: "navy" },
      { name: "Black", hex: "#000000", type: "fabric", value: "black" },
      { name: "White", hex: "#FFFFFF", type: "fabric", value: "white" },
      { name: "Gray", hex: "#6B7280", type: "fabric", value: "gray" }
    ],
    'shoes': [
      { name: "White", hex: "#FFFFFF", type: "upper", value: "white" },
      { name: "Black", hex: "#000000", type: "upper", value: "black" },
      { name: "Navy", hex: "#1E3A8A", type: "upper", value: "navy" },
      { name: "Gray", hex: "#6B7280", type: "upper", value: "gray" }
    ],
    'default': [
      { name: "Black", hex: "#000000", type: "color", value: "black" },
      { name: "White", hex: "#FFFFFF", type: "color", value: "white" },
      { name: "Blue", hex: "#2563EB", type: "color", value: "blue" }
    ]
  };

  // Size sets
  const sizeSets = {
    'phone': ["64GB", "128GB", "256GB", "512GB"],
    'laptop': ["8GB/256GB", "16GB/512GB", "32GB/1TB"],
    'tablet': ["64GB", "128GB", "256GB"],
    't-shirt': ["S", "M", "L", "XL", "XXL"],
    'shirt': ["S", "M", "L", "XL", "XXL"],
    'shoes': ["7", "8", "9", "10", "11", "12"],
    'sneakers': ["7", "8", "9", "10", "11", "12"],
    'watch': ["40mm", "42mm", "44mm", "46mm"],
    'book': ["Paperback", "Hardcover", "E-book"],
    'default': ["Standard", "One Size"]
  };

  // Return configuration object
  return {
    sizeMeaning: sizeMeanings[productType] || sizeMeanings.default,
    sizeDescription: sizeDescriptions[productType] || sizeDescriptions.default,
    colors: colorSets[productType] || colorSets.default,
    sizes: sizeSets[productType] || sizeSets.default,
    colorType: productType === 'phone' ? 'finish' : 
               productType === 't-shirt' ? 'fabric' :
               productType === 'shoes' ? 'upper' : 'color'
  };
};

// For ProductCreate.jsx - Get colors and sizes from category
export const getConfigsFromCategory = (category) => {
  if (!category) return null;
  
  return {
    productType: category.productType || 'default',
    colors: category.defaultColors || getProductTypeConfigs('default').colors,
    sizes: category.defaultSizes || getProductTypeConfigs('default').sizes,
    sizeMeaning: category.sizeMeaning || getProductTypeConfigs('default').sizeMeaning
  };
};