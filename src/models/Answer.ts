import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswer extends Document {
  userId: mongoose.Types.ObjectId;
  moduleId: number;
  questionId: number;
  answer: string;
  isCorrect?: boolean;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      // index: true removed - covered by compound index below
    },
    moduleId: {
      type: Number,
      required: [true, 'Module ID is required'],
      // index: true removed - covered by compound index below
    },
    questionId: {
      type: Number,
      required: [true, 'Question ID is required'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    isCorrect: {
      type: Boolean,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
AnswerSchema.index({ userId: 1, moduleId: 1, questionId: 1 }, { unique: true });

const Answer: Model<IAnswer> = mongoose.models.Answer || mongoose.model<IAnswer>('Answer', AnswerSchema);

export default Answer;
