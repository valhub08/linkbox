import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';
import { auth } from '@/auth';

// GET single bookmark
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

    const bookmark = await Bookmark.findById(id);

    if (!bookmark) {
      return NextResponse.json(
        { success: false, error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (bookmark.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this bookmark' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: bookmark }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookmark' },
      { status: 500 }
    );
  }
}

// PUT update bookmark
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

    // Verify ownership before update
    const existingBookmark = await Bookmark.findById(id);

    if (!existingBookmark) {
      return NextResponse.json(
        { success: false, error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    if (existingBookmark.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this bookmark' },
        { status: 403 }
      );
    }

    const bookmark = await Bookmark.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: bookmark }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update bookmark' },
      { status: 500 }
    );
  }
}

// PATCH update bookmark (partial update)
export async function PATCH(
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

    // Verify ownership before update
    const existingBookmark = await Bookmark.findById(id);

    if (!existingBookmark) {
      return NextResponse.json(
        { success: false, error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    if (existingBookmark.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this bookmark' },
        { status: 403 }
      );
    }

    const bookmark = await Bookmark.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: bookmark }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update bookmark' },
      { status: 500 }
    );
  }
}

// DELETE bookmark
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

    // Verify ownership before delete
    const bookmark = await Bookmark.findById(id);

    if (!bookmark) {
      return NextResponse.json(
        { success: false, error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    if (bookmark.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this bookmark' },
        { status: 403 }
      );
    }

    await Bookmark.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Bookmark deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}
