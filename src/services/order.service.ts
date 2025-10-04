import mongoose from 'mongoose';
import OrderModel, { OrderDocument } from '../models/Order';
import MenuModel from '../models/Menu';
import logger from '../utils/logger';
import config from '../config';

const createOrder = async (payload: any): Promise<OrderDocument> => {
  // Try to use session / transaction if available (replica set)
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Check inventory for each line item, decrement sold if available
    for (const it of payload.items) {
      const menu = await MenuModel.findOne({ 'items._id': it.itemId }).session(session);
      if (!menu) throw new Error('Menu item not found');
      const menuItem = menu.items.id(it.itemId);
      if (!menuItem) throw new Error('Menu item not found');
      const total = (menuItem.inventory?.total ?? Infinity) - (menuItem.inventory?.sold ?? 0);
      if (typeof total === 'number' && total < it.qty) throw new Error(`Insufficient inventory for ${menuItem.name}`);
      // decrement sold
      if (menuItem.inventory && typeof menuItem.inventory.sold === 'number') {
        menuItem.inventory.sold = (menuItem.inventory.sold || 0) + it.qty;
        await menu.save({ session });
      }
    }

    const order = new OrderModel(payload);
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error('createOrder transaction failed', err as Error);
    throw err;
  }
};

export default { createOrder };
