import { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  color?: string;
  userId: string;
  order: number;
  createdAt: Date;
}

export interface IBookmark extends Document {
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  favicon?: string;
  categoryId: string;
  userId: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}
