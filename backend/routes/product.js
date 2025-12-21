import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getFeaturedProducts, 
  getProductById, 
  getProductsByCategory,
  searchProducts 
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const ProductRouter = express.Router();

// Public routes

ProductRouter.get('/featured', getFeaturedProducts);
ProductRouter.get('/search', searchProducts);
ProductRouter.get('/category/:category', getProductsByCategory);
ProductRouter.get('/:id', getProductById);


ProductRouter.get('/', getProducts);

// Admin routes (we'll add auth middleware later)
ProductRouter.post('/', upload.array('images', 10), createProduct);

export default ProductRouter;