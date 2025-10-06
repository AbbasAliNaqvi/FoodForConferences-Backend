import { Request, Response } from 'express';
import Vendor from '../models/vendor';
import logger from '../utils/logger';

const getVendors = async (req: Request, res: Response) => {
  try {
    const sort = req.query.sort as string;

    let vendors;

    if (sort === 'popular') {
      vendors = await Vendor.find().sort({ rating: -1 }).limit(5).lean(); // top 5
    } else {
      vendors = await Vendor.find().lean();
    }

    res.status(200).json(vendors);
  } catch (err) {
    logger.error('Error fetching vendors', err as Error);
    res.status(500).json({ message: 'Failed to fetch vendors' });
  }
};

export default { getVendors };
