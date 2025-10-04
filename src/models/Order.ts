import mongoose, { Document, Schema } from 'mongoose';

export interface OrderItem {
  itemId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  qty: number;
  price: number;
  name?: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'queued' | 'preparing' | 'ready' | 'picked' | 'completed' | 'cancelled';

export interface OrderDocument extends Document {
  eventId: mongoose.Types.ObjectId;
  attendeeId: mongoose.Types.ObjectId;
  items: OrderItem[];
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  slotId?: string;
  qrToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
  itemId: { type: Schema.Types.ObjectId, required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  name: { type: String }
}, { _id: false });

const OrderSchema = new Schema<OrderDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    attendeeId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [OrderItemSchema],
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['queued','preparing','ready','picked','completed','cancelled'], default: 'queued' },
    slotId: String,
    qrToken: String
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);
export default OrderModel;
