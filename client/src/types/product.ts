export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  brand: string;
  inStock: boolean;
  badge?: 'BEST SELLER' | 'TRENDING' | 'PREMIUM' | 'POPULAR' | 'NEW' | 'LUXURY' | 'SALE';
}

export interface Category {
  id: string;
  name: string;
  itemCount: number;
  icon: string;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
