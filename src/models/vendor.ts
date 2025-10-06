import mongoose, { Schema, Document } from 'mongoose';

export interface VendorDocument extends Document {
  name: string;
  cuisine?: string;
  logoUrl?: string;
  rating: number;
  description?: string;
}

const VendorSchema = new Schema<VendorDocument>(
  {
    name: { type: String, required: true },
    cuisine: { type: String },
    logoUrl: { type: String },
    rating: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);

const Vendor = mongoose.model<VendorDocument>('Vendor', VendorSchema);
export default Vendor;
