import mongoose, { Schema, Model } from 'mongoose';
import { ICategory } from '@/types';

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters'],
  },
  color: {
    type: String,
    default: '#6B7280',
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User',
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance optimization
// Compound index for user categories queries with sorting
CategorySchema.index({ userId: 1, order: 1, createdAt: 1 });

// Index for efficient category lookups
CategorySchema.index({ userId: 1, name: 1 });

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
