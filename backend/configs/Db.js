import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/e-commerce`);
   logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;

