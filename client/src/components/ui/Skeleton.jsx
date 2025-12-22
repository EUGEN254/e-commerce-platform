import React from "react";
import { cn } from "../../lib/utils";


export const Skeleton = React.forwardRef(
  ({ className, variant = "default", shimmer = true, ...props }, ref) => {
    const baseClasses = "relative overflow-hidden bg-gray-200 rounded-md";
    
    const variants = {
      default: "",
      card: "rounded-xl",
      circle: "rounded-full",
      text: "h-4",
      title: "h-6",
      subtitle: "h-5",
      avatar: "rounded-full h-10 w-10",
      button: "h-10 rounded-lg",
      image: "aspect-square",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          shimmer && "animate-pulse",
          className
        )}
        {...props}
      >
        {shimmer && (
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// Pre-built Skeleton Components
export const SkeletonCard = ({ className, children, ...props }) => (
  <div className={cn("space-y-3", className)} {...props}>
    <Skeleton variant="image" className="h-48 w-full" />
    <div className="space-y-2">
      <Skeleton variant="title" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-20" />
      <Skeleton variant="button" className="w-24" />
    </div>
    {children}
  </div>
);

export const SkeletonProductCard = ({ className, ...props }) => (
  <div className={cn("space-y-3", className)} {...props}>
    <Skeleton variant="image" className="h-60 w-full rounded-lg" />
    <div className="space-y-2 p-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="title" className="w-3/4" />
      <div className="flex items-center space-x-2">
        <Skeleton variant="text" className="w-16" />
        <Skeleton variant="text" className="w-20" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton variant="text" className="w-24" />
        <Skeleton variant="button" className="w-28" />
      </div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3, className, ...props }) => (
  <div className={cn("space-y-2", className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={i === lines - 1 ? "w-2/3" : "w-full"}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = "md", className, ...props }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  return (
    <Skeleton
      variant="avatar"
      className={cn(sizes[size], className)}
      {...props}
    />
  );
};

export const SkeletonTable = ({ rows = 5, columns = 4, className, ...props }) => (
  <div className={cn("space-y-3", className)} {...props}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" className="h-6 flex-1" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            className={cn(
              "h-10",
              colIndex === 0 ? "w-16" : "flex-1",
              colIndex === columns - 1 && "w-24"
            )}
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonProfile = ({ className, ...props }) => (
  <div className={cn("space-y-4", className)} {...props}>
    <div className="flex items-center space-x-4">
      <SkeletonAvatar size="lg" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="title" className="w-48" />
        <Skeleton variant="text" className="w-32" />
      </div>
    </div>
    <div className="space-y-3 pt-4">
      <Skeleton variant="subtitle" className="w-36" />
      <SkeletonText lines={4} />
    </div>
    <div className="grid grid-cols-2 gap-4 pt-2">
      <Skeleton variant="text" className="h-8" />
      <Skeleton variant="text" className="h-8" />
    </div>
  </div>
);

export const SkeletonDashboard = ({ className, ...props }) => (
  <div className={cn("space-y-6", className)} {...props}>
    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2 p-4 bg-white rounded-lg shadow">
          <Skeleton variant="text" className="w-24" />
          <Skeleton variant="title" className="w-16" />
          <Skeleton variant="text" className="w-32" />
        </div>
      ))}
    </div>
    
    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3 p-4 bg-white rounded-lg shadow">
        <Skeleton variant="subtitle" className="w-48" />
        <Skeleton variant="image" className="h-64 w-full" />
      </div>
      <div className="space-y-3 p-4 bg-white rounded-lg shadow">
        <Skeleton variant="subtitle" className="w-48" />
        <Skeleton variant="image" className="h-64 w-full" />
      </div>
    </div>
    
    {/* Table */}
    <div className="p-4 bg-white rounded-lg shadow">
      <SkeletonTable rows={5} columns={5} />
    </div>
  </div>
);

export const SkeletonCheckout = ({ className, ...props }) => (
  <div className={cn("space-y-6", className)} {...props}>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Forms */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4 p-6 bg-white rounded-xl">
          <Skeleton variant="title" className="w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Skeleton variant="text" className="h-4 w-32" />
              <Skeleton variant="button" className="h-10" />
            </div>
            <div className="space-y-3">
              <Skeleton variant="text" className="h-4 w-32" />
              <Skeleton variant="button" className="h-10" />
            </div>
            <div className="space-y-3">
              <Skeleton variant="text" className="h-4 w-32" />
              <Skeleton variant="button" className="h-10" />
            </div>
            <div className="space-y-3">
              <Skeleton variant="text" className="h-4 w-32" />
              <Skeleton variant="button" className="h-10" />
            </div>
          </div>
        </div>
        
        {/* Payment Section */}
        <div className="space-y-4 p-6 bg-white rounded-xl">
          <Skeleton variant="title" className="w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-20" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Column - Order Summary */}
      <div className="space-y-4 p-6 bg-white rounded-xl">
        <Skeleton variant="title" className="w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton variant="image" className="h-16 w-16" />
              <div className="space-y-2 flex-1">
                <Skeleton variant="text" className="w-32" />
                <Skeleton variant="text" className="w-24" />
              </div>
              <Skeleton variant="text" className="w-16" />
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="text" className="w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="text" className="w-20" />
          </div>
          <div className="flex justify-between pt-2">
            <Skeleton variant="title" className="w-32" />
            <Skeleton variant="title" className="w-24" />
          </div>
        </div>
        <Skeleton variant="button" className="h-12 w-full mt-4" />
      </div>
    </div>
  </div>
);

export const SkeletonNavbar = ({ className, ...props }) => (
  <div className={cn("flex items-center justify-between p-4", className)} {...props}>
    <div className="flex items-center space-x-4">
      <Skeleton variant="text" className="h-8 w-32" />
      <div className="hidden md:flex space-x-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-6 w-16" />
        ))}
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton variant="avatar" className="h-8 w-8" />
      <Skeleton variant="button" className="h-10 w-24" />
    </div>
  </div>
);

export const SkeletonHero = ({ className, ...props }) => (
  <div className={cn("relative overflow-hidden rounded-2xl", className)} {...props}>
    <Skeleton variant="image" className="h-96 w-full" />
    <div className="absolute inset-0 flex items-center p-12">
      <div className="space-y-4 max-w-2xl">
        <Skeleton variant="title" className="h-12 w-3/4" />
        <SkeletonText lines={3} />
        <div className="flex space-x-4 pt-4">
          <Skeleton variant="button" className="h-12 w-32" />
          <Skeleton variant="button" className="h-12 w-40" />
        </div>
      </div>
    </div>
  </div>
);

// Special Skeleton for your Limited Offers
export const SkeletonLimitedOffers = ({ count = 5, className, ...props }) => (
  <div className={cn("space-y-4", className)} {...props}>
    {/* Title */}
    <div className="flex items-center gap-2">
      <Skeleton variant="circle" className="h-6 w-6" />
      <Skeleton variant="title" className="w-48" />
      <Skeleton variant="text" className="flex-1 h-1" />
    </div>
    
    {/* Scrolling Offers */}
    <div className="flex gap-6 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 space-y-2">
          <Skeleton variant="image" className="h-32 w-32 rounded-xl" />
          <div className="space-y-1">
            <Skeleton variant="text" className="w-24" />
            <div className="flex justify-between">
              <Skeleton variant="text" className="w-16" />
              <Skeleton variant="circle" className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {/* View All Button */}
    <div className="text-center">
      <Skeleton variant="text" className="h-6 w-40 mx-auto" />
    </div>
  </div>
);

// Loading State Wrapper
export const SkeletonWrapper = ({ isLoading, children, skeleton, ...props }) => {
  if (isLoading) {
    return skeleton || <Skeleton {...props} />;
  }
  return children;
};

// Custom hook for staggered loading
export const useStaggeredLoading = (count = 3, delay = 150) => {
  const [loadedItems, setLoadedItems] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setLoadedItems(prev => {
        if (prev >= count) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, delay);
    
    return () => clearInterval(timer);
  }, [count, delay]);
  
  return loadedItems;
};