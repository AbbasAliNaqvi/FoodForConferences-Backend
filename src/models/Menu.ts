import mongoose, { Document, Schema } from 'mongoose';

export interface MenuItem {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  tags?: string[];
  allergens?: string[];
  imageUrl?: string;
  inventory?: { total?: number; sold?: number };
  prepTimeMinutes?: number;
  vendorId: string;
}

export interface MenuDocument extends Document {
  vendorId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  title: string;
  items: MenuItem[];
  availableFrom?: Date;
  availableTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<MenuItem>({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  tags: [String],
  allergens: [String],
  imageUrl: String,
  inventory: {
    total: Number,
    sold: { type: Number, default: 0 }
  },
  prepTimeMinutes: Number
}, { _id: true });

const MenuSchema = new Schema<MenuDocument>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    title: { type: String, required: true },
    items: [MenuItemSchema],
    availableFrom: Date,
    availableTo: Date
  },
  { timestamps: true }
);

const MenuModel = mongoose.model<MenuDocument>('Menu', MenuSchema);
export default MenuModel;
