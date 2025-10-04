import OrderModel, { OrderDocument } from '../models/Order';
import MenuModel from '../models/Menu';
import logger from '../utils/logger';

const createOrder = async (payload: any): Promise<OrderDocument> => {
  try {
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    let total = 0;

    for (const it of payload.items) {
      // Ensure qty is provided
      const qty = Number(it.qty ?? 0);
      if (isNaN(qty) || qty <= 0) {
        throw new Error(`Invalid quantity for item ${it.itemId}`);
      }
      it.qty = qty;

      // Find the menu item
      const menu = await MenuModel.findOne({ 'items._id': it.itemId });
      if (!menu) throw new Error('Menu item not found');

      const menuItem = menu.items.id(it.itemId);
      if (!menuItem) throw new Error('Menu item not found');

      // Auto-fill price and name from menu
      it.price = Number(menuItem.price ?? 0);
      it.name = menuItem.name ?? '';

      // Calculate total
      total += it.price * it.qty;

      // Check inventory
      const available = (menuItem.inventory?.total ?? Infinity) - (menuItem.inventory?.sold ?? 0);
      if (available < qty) throw new Error(`Insufficient inventory for ${menuItem.name}`);

      // Update sold safely
      if (menuItem.inventory) {
        const currentSold = Number(menuItem.inventory.sold ?? 0);
        menuItem.inventory.sold = currentSold + qty;
        await menu.save();
      }
    }

    // Set total in payload
    payload.total = total;

    // Save the order
    const order = new OrderModel(payload);
    await order.save();

    return order;
  } catch (err) {
    logger.error('Create order error', err as Error);
    throw err;
  }
};

export default { createOrder };
