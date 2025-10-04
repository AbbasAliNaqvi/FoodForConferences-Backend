import mongoose from 'mongoose';
import config from '../config';
import logger from '../utils/logger';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      // options mostly default in modern mongoose
    });
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error', err as Error);
    process.exit(1);
  }
};

export default connectDB;
