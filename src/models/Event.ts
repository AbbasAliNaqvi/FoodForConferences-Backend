import mongoose, { Document, Schema } from 'mongoose';

export interface MealSlot {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  capacity?: number;
}

export interface EventAttrs {
  title: string;
  description?: string;
  organizerId: mongoose.Types.ObjectId;
  venue?: { name?: string; address?: string; geo?: { lat?: number; lng?: number } };
  startDate?: Date;
  endDate?: Date;
  mealSlots?: MealSlot[];
  vendorIds?: mongoose.Types.ObjectId[];
}

export interface EventDocument extends Document {
  title: string;
  description?: string;
  organizerId: mongoose.Types.ObjectId;
  venue?: { name?: string; address?: string; geo?: { lat?: number; lng?: number } };
  startDate?: Date;
  endDate?: Date;
  mealSlots: MealSlot[];
  vendorIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MealSlotSchema = new Schema<MealSlot>({
  id: { type: String },
  name: { type: String },
  startTime: { type: Date },
  endTime: { type: Date },
  capacity: { type: Number }
}, { _id: false });

const EventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    organizerId: { type: Schema.Types.ObjectId, ref: 'User' },
    venue: {
      name: String,
      address: String,
      geo: { lat: Number, lng: Number }
    },
    startDate: Date,
    endDate: Date,
    mealSlots: [MealSlotSchema],
    vendorIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
export default EventModel;
