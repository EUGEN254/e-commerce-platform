import express from 'express';
import { 
  getProducts, 
  getFeaturedProducts, 
  getProductById, 
  getProductsByCategory,
  searchProducts 
} from '../controllers/productController.js';

const ProductRouter = express.Router();

// Public routes
ProductRouter.get('/featured', getFeaturedProducts);
ProductRouter.get('/search', searchProducts);
ProductRouter.get('/category/:category', getProductsByCategory);
ProductRouter.get('/:id', getProductById);
ProductRouter.get('/', getProducts);



export default ProductRouter;