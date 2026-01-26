import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideo extends Document {
  moduleId: number;
  videoType: 'english' | 'punjabi' | 'hindi' | 'activity';
  videoId: number;
  preview: string;
  fileName: string;
  fileSize: number;
  fileUrl?: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    moduleId: {
      type: Number,
      required: [true, 'Module ID is required'],
      index: true,
    },
    videoType: {
      type: String,
      enum: ['english', 'punjabi', 'hindi', 'activity'],
      required: [true, 'Video type is required'],
      index: true,
    },
    videoId: {
      type: Number,
      required: [true, 'Video ID is required'],
    },
    preview: {
      type: String,
      required: [true, 'Preview is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    fileUrl: {
      type: String,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
VideoSchema.index({ moduleId: 1, videoType: 1, videoId: 1 }, { unique: true });

const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
