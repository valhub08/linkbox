import mongoose, { Schema, Model } from 'mongoose';
import { IBookmark } from '@/types';

const BookmarkSchema = new Schema<IBookmark>({
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  thumbnail: {
    type: String,
  },
  favicon: {
    type: String,
  },
  categoryId: {
    type: String,
    required: [true, 'Category ID is required'],
    ref: 'Category',
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User',
  },
  tags: {
    type: [String],
    default: [],
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [5000, 'Notes cannot exceed 5000 characters'],
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
BookmarkSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for performance optimization
// Compound index for user bookmarks queries (most common query pattern)
BookmarkSchema.index({ userId: 1, createdAt: -1 });

// Index for category-based queries
BookmarkSchema.index({ userId: 1, categoryId: 1 });

// Index for favorite bookmarks
BookmarkSchema.index({ userId: 1, isFavorite: 1 });

// Text index for search functionality
BookmarkSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

export default Bookmark;
