import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
  id: number;
  moduleId: number;
  question: string;
  options: string[];
  correctAnswer?: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    id: {
      type: Number,
      required: true,
    },
    moduleId: {
      type: Number,
      required: [true, 'Module ID is required'],
      index: true,
    },
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Question options are required'],
      validate: {
        validator: (options: string[]) => options.length >= 2,
        message: 'Question must have at least 2 options',
      },
    },
    correctAnswer: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
QuestionSchema.index({ moduleId: 1, id: 1 }, { unique: true });

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
