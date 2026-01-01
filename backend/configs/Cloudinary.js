import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      timeout: 30000, // 30 seconds timeout for all operations
      max_retries: 2, // Retry failed requests up to 2 times
    });
  } catch (error) {
    // Connection error handled silently
  }
};

export default connectCloudinary;
