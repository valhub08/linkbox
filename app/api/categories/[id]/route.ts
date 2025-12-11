import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Bookmark from '@/models/Bookmark';
import { auth } from '@/auth';

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (category.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this category' },
        { status: 403 }
      );
    }

    const bookmarkCount = await Bookmark.countDocuments({
      categoryId: id,
      userId: session.user.email
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...category.toObject(),
          bookmarkCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // First, verify the category exists and user owns it
    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingCategory.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this category' },
        { status: 403 }
      );
    }

    // Update the category
    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // First, verify the category exists and user owns it
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (category.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this category' },
        { status: 403 }
      );
    }

    // Check if category has bookmarks
    const bookmarkCount = await Bookmark.countDocuments({
      categoryId: id,
      userId: session.user.email
    });

    if (bookmarkCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete category with bookmarks. Please move or delete bookmarks first.',
        },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
