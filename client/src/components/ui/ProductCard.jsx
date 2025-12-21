import { Star, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function ProductCard({ product, index = 0, viewMode = 'grid' }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Calculate discount if originalPrice exists
  const discount = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  // Determine badge based on product properties
  const getProductBadge = () => {
    if (product.badge) return product.badge;
    if (product.isBestSeller) return 'BEST SELLER';
    if (product.isNew) return 'NEW';
    if (product.isFeatured) return 'PREMIUM';
    if (discount > 0) return 'SALE';
    return null;
  };

  const badgeVariants = {
    'BEST SELLER': 'bg-primary text-primary-foreground',
    'TRENDING': 'bg-accent text-accent-foreground',
    'PREMIUM': 'bg-foreground text-background',
    'POPULAR': 'bg-success text-success-foreground',
    'NEW': 'bg-primary/80 text-primary-foreground',
    'LUXURY': 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    'SALE': 'bg-sale text-sale-foreground',
  };

  // Ensure product has required properties with defaults
  const safeProduct = {
    id: product.id || product._id || `temp-${index}`,
    name: product.name || 'Unnamed Product',
    price: typeof product.price === 'number' ? product.price : 0,
    originalPrice: product.originalPrice || null,
    discount: discount,
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    image: product.image || product.mainImage || (product.images && product.images[0]) || '/placeholder-image.jpg',
    category: product.category || 'Uncategorized',
    description: product.description || product.shortDescription || 'No description available',
    brand: product.brand || 'Unknown Brand',
    inStock: product.inStock !== undefined ? product.inStock : true,
    stock: product.stock || 0,
    badge: getProductBadge(),
    isNew: product.isNew || false,
    isBestSeller: product.isBestSeller || false,
    isFeatured: product.isFeatured || false,
    tags: product.tags || [],
    features: product.features || [],
    // Add other properties with defaults as needed
  };

  const [imageError, setImageError] = useState(false);

  const handleProductClick = () => {
    navigate(`/product/${safeProduct.id}`);
  }

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    addToCart(safeProduct);
  }

  const handleImageError = () => {
    setImageError(true);
  }

  // List view layout
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        viewport={{ once: true }}
        className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 flex cursor-pointer"
        onClick={handleProductClick}
      >
        {/* Image Container - Smaller for list view */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 overflow-hidden">
          <img
            src={imageError ? '/placeholder-image.jpg' : safeProduct.image}
            alt={safeProduct.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* Badge */}
          {safeProduct.badge && (
            <Badge className={cn('absolute top-2 left-2 text-xs font-semibold', badgeVariants[safeProduct.badge])}>
              {safeProduct.badge}
            </Badge>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-sale text-sale-foreground text-xs font-semibold">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div>
            {/* Category */}
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{safeProduct.category}</p>

            {/* Name */}
            <h3 className="font-display font-semibold text-foreground line-clamp-1 leading-tight mt-1">
              {safeProduct.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{safeProduct.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-rating text-rating" />
                <span className="text-sm font-medium">{safeProduct.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">({safeProduct.reviewCount})</span>
            </div>

            {/* Brand & Stock */}
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span className="text-muted-foreground">Brand: {safeProduct.brand}</span>
              {safeProduct.inStock ? (
                <span className="flex items-center gap-1 text-success">
                  <Check className="h-3 w-3" />
                  {safeProduct.stock > 0 ? `In Stock (${safeProduct.stock})` : 'In Stock'}
                </span>
              ) : (
                <span className="text-sale">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Price and Add to Cart - Bottom aligned */}
          <div className="flex items-center justify-between mt-auto pt-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-foreground">
                ${safeProduct.price.toFixed(2)}
              </span>
              {safeProduct.originalPrice && safeProduct.originalPrice > safeProduct.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${safeProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCartClick}
              className="gap-2"
              size="sm"
              disabled={!safeProduct.inStock}
            >
              <ShoppingCart className="h-4 w-4" />
              {safeProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageError ? '/placeholder-image.jpg' : safeProduct.image}
          alt={safeProduct.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Badge */}
        {safeProduct.badge && (
          <Badge className={cn('absolute top-3 left-3 text-xs font-semibold', badgeVariants[safeProduct.badge])}>
            {safeProduct.badge}
          </Badge>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-sale text-sale-foreground text-xs font-semibold">
            -{discount}%
          </Badge>
        )}

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCartClick}
            className="w-full gap-2"
            size="sm"
            disabled={!safeProduct.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
            {safeProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{safeProduct.category}</p>

        {/* Name */}
        <h3 className="font-display font-semibold text-foreground line-clamp-2 leading-tight">
          {safeProduct.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{safeProduct.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-rating text-rating" />
            <span className="text-sm font-medium">{safeProduct.rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">({safeProduct.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-foreground">
            ${safeProduct.price.toFixed(2)}
          </span>
          {safeProduct.originalPrice && safeProduct.originalPrice > safeProduct.price && (
            <span className="text-sm text-muted-foreground line-through">
              ${safeProduct.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Brand & Stock */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Brand: {safeProduct.brand}</span>
          {safeProduct.inStock ? (
            <span className="flex items-center gap-1 text-success">
              <Check className="h-3 w-3" />
              {safeProduct.stock > 0 ? `${safeProduct.stock} left` : 'In Stock'}
            </span>
          ) : (
            <span className="text-sale">Out of Stock</span>
          )}
        </div>

        {/* Tags */}
        {safeProduct.tags && safeProduct.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {safeProduct.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-muted rounded-full">
                {tag}
              </span>
            ))}
            {safeProduct.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-muted rounded-full">
                +{safeProduct.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}