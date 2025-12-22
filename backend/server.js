import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/Db.js';
import connectCloudinary from './configs/Cloudinary.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import productRouter from './routes/product.js';
import categoryRoutes from './routes/category.js';
import limitedOfferRouter from './routes/limitedOffers.js';

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// cloudinary setup
connectCloudinary();



// determine environment and allow connections accordingly
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = (
    isProduction ? process.env.PROD_ORIGINS : process.env.DEV_ORIGINS
)?.split(',');


// middleware to handle CORS
app.use(express.json({limit: '10mb'}));
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

// sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// routes
app.use('/api/products',productRouter);
app.use('/api/categories', categoryRoutes);
app.use('/api/limited-offers', limitedOfferRouter);


// connect to database
await connectDB();


// start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});