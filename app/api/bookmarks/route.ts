import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';
import { auth } from '@/auth';

// GET all bookmarks
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const query: any = { userId: session.user.email };
    if (categoryId) {
      query.categoryId = categoryId;
    }

    const bookmarks = await Bookmark.find(query).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: bookmarks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

// POST create new bookmark
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
    const { url, title, description, thumbnail, favicon, categoryId, tags, notes } = body;

    if (!url || !title || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'URL, title, and categoryId are required' },
        { status: 400 }
      );
    }

    const bookmark = await Bookmark.create({
      url,
      title,
      description,
      thumbnail,
      favicon,
      categoryId,
      userId: session.user.email,
      tags: tags || [],
      isFavorite: false,
      notes,
    });

    return NextResponse.json({ success: true, data: bookmark }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}
