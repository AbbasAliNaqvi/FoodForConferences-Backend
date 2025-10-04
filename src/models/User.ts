import mongoose, { Document, Schema } from 'mongoose';

export type Role = 'attendee' | 'organizer' | 'vendor' | 'staff' | 'admin';

export interface UserAttrs {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
  dietaryPreferences?: string[];
  allergies?: string[];
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  dietaryPreferences: string[];
  allergies: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['attendee','organizer','vendor','staff','admin'], default: 'attendee' },
    dietaryPreferences: [{ type: String }],
    allergies: [{ type: String }]
  },
  { timestamps: true }
);

const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;
