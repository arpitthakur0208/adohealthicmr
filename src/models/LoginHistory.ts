import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILoginHistory extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  email: string;
  role: 'user' | 'admin';
  loginAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const LoginHistorySchema = new Schema<ILoginHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    loginAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
LoginHistorySchema.index({ userId: 1, loginAt: -1 });
LoginHistorySchema.index({ loginAt: -1 });
LoginHistorySchema.index({ role: 1, loginAt: -1 });

const LoginHistory: Model<ILoginHistory> = mongoose.models.LoginHistory || mongoose.model<ILoginHistory>('LoginHistory', LoginHistorySchema);

export default LoginHistory;
