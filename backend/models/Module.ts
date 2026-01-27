import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IModule extends Document {
  id: number;
  title: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Module description is required'],
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Note: id field already has unique: true which creates an index automatically
// No need for explicit index() call

const Module: Model<IModule> = mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);

export default Module;
