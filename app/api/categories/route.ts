import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Bookmark from '@/models/Bookmark';
import { auth } from '@/auth';

// GET all categories with bookmark counts
export async function GET() {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use aggregation to get categories with bookmark counts in a single query
    const categoriesWithCount = await Category.aggregate([
      // Match categories for this user
      { $match: { userId: session.user.email } },

      // Sort by order and createdAt
      { $sort: { order: 1, createdAt: 1 } },

      // Convert _id to string for lookup
      { $addFields: { categoryIdStr: { $toString: '$_id' } } },

      // Left join with bookmarks to count
      {
        $lookup: {
          from: 'bookmarks',
          let: { categoryId: '$categoryIdStr', userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$categoryId', '$$categoryId'] },
                    { $eq: ['$userId', '$$userId'] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'bookmarkData'
        }
      },

      // Extract bookmark count
      {
        $addFields: {
          bookmarkCount: {
            $ifNull: [{ $arrayElemAt: ['$bookmarkData.count', 0] }, 0]
          }
        }
      },

      // Remove temporary fields
      { $project: { categoryIdStr: 0, bookmarkData: 0 } }
    ]);

    return NextResponse.json({ success: true, data: categoriesWithCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      color: color || '#6B7280',
      userId: session.user.email,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
