import { Star, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

export function ProductCard({ product, index = 0, viewMode = 'grid' }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const badgeVariants = {
    'BEST SELLER': 'bg-primary text-primary-foreground',
    'TRENDING': 'bg-accent text-accent-foreground',
    'PREMIUM': 'bg-foreground text-background',
    'POPULAR': 'bg-success text-success-foreground',
    'NEW': 'bg-primary/80 text-primary-foreground',
    'LUXURY': 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    'SALE': 'bg-sale text-sale-foreground',
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        viewport={{ once: true }}
        className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 flex"
      >
        {/* Image Container - Smaller for list view */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badge */}
          {product.badge && (
            <Badge className={cn('absolute top-2 left-2 text-xs font-semibold', badgeVariants[product.badge])}>
              {product.badge}
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
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>

            {/* Name */}
            <h3 className="font-display font-semibold text-foreground line-clamp-1 leading-tight mt-1">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-rating text-rating" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
            </div>

            {/* Brand & Stock */}
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span className="text-muted-foreground">Brand: {product.brand}</span>
              {product.inStock ? (
                <span className="flex items-center gap-1 text-success">
                  <Check className="h-3 w-3" />
                  In Stock
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
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              onClick={() => addToCart(product)}
              className="gap-2"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (your original code)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badge */}
        {product.badge && (
          <Badge className={cn('absolute top-3 left-3 text-xs font-semibold', badgeVariants[product.badge])}>
            {product.badge}
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
            onClick={() => addToCart(product)}
            className="w-full gap-2"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>

        {/* Name */}
        <h3 className="font-display font-semibold text-foreground line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-rating text-rating" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Brand & Stock */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Brand: {product.brand}</span>
          {product.inStock ? (
            <span className="flex items-center gap-1 text-success">
              <Check className="h-3 w-3" />
              In Stock
            </span>
          ) : (
            <span className="text-sale">Out of Stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}