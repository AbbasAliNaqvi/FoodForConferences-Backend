import User, { UserDocument } from '../models/User';
import logger from '../utils/logger';

export const findById = async (id: string): Promise<UserDocument | null> => {
  try {
    return await User.findById(id).select('-passwordHash');
  } catch (err) {
    logger.error('findById error', err as Error);
    return null;
  }
};

export default { findById };
