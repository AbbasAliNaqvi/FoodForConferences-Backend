import dotenv from 'dotenv';
dotenv.config();

const getNum = (v?: string, fallback = 5000) => (v ? Number(v) : fallback);

const config = {
  port: getNum(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/the2conferences',
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshTokenExpiresIn: process.env.REFRESH_EXPIRES_IN || '7d',
  stripeSecret: process.env.STRIPE_SECRET || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
};

export default config;
