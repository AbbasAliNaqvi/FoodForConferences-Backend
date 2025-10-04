import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';
import logger from '../utils/logger';

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    logger.error('Token verify error', err as Error);
    return null;
  }
};

// refresh token logic placeholder: in production, store refresh tokens hashed in DB
export default {
  signAccessToken,
  verifyAccessToken
};
