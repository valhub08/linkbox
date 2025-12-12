'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import BookmarkListItem from '@/components/BookmarkListItem';
import BookmarkListViewItem from '@/components/BookmarkListViewItem';
import AddBookmarkModal from '@/components/AddBookmarkModal';
import AddCategoryModal from '@/components/AddCategoryModal';
import EditBookmarkModal from '@/components/EditBookmarkModal';
import NotesModal from '@/components/NotesModal';
import TopNavigation from '@/components/TopNavigation';
import WebPreviewPanel from '@/components/WebPreviewPanel';
import SearchBar from '@/components/SearchBar';
import FilterControls from '@/components/FilterControls';
import EmptyState from '@/components/EmptyState';
import { IBookmark, ICategory } from '@/types';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<(ICategory & { bookmarkCount: number })[]>([]);
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favorites' | 'recent' | null>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'mylinks'>('home');
  const [isAddBookmarkModalOpen, setIsAddBookmarkModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditBookmarkModalOpen, setIsEditBookmarkModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<IBookmark | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesBookmark, setNotesBookmark] = useState<IBookmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [timePeriod, setTimePeriod] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title-asc' | 'title-desc'>('newest');

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await fetch('/api/bookmarks');
      const result = await response.json();
      if (result.success) {
        setBookmarks(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Initial load - only fetch when authenticated
  useEffect(() => {
    if (session) {
      fetchCategories();
      fetchBookmarks();
    }
  }, [session]);

  // Load view mode and theme from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('viewMode') as 'card' | 'list' | null;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }

    // Load and apply theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const applyTheme = (theme: string) => {
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      applyTheme('light');
    }
  }, []);

  // Calculate all unique tags
  const allTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    bookmarks.forEach((bookmark) => {
      bookmark.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [bookmarks]);

  // Filter bookmarks based on selected filters
  const filteredBookmarks = useMemo(() => {
    let result = bookmarks;

    // Filter by category
    if (selectedCategoryId) {
      result = result.filter((b) => b.categoryId === selectedCategoryId);
    }

    // Filter by favorites/recent
    if (selectedFilter === 'favorites') {
      result = result.filter((b) => b.isFavorite);
    } else if (selectedFilter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter((b) => new Date(b.createdAt) >= sevenDaysAgo);
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter((b) => b.tags?.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query) ||
          b.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by time period
    if (timePeriod !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (timePeriod) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      result = result.filter((b) => new Date(b.createdAt) >= startDate);
    }

    // Sort bookmarks
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title, 'ko');
        case 'title-desc':
          return b.title.localeCompare(a.title, 'ko');
        default:
          return 0;
      }
    });

    return result;
  }, [bookmarks, selectedCategoryId, selectedFilter, selectedTag, searchQuery, timePeriod, sortBy]);

  // Calculate counts
  const favoritesCount = bookmarks.filter((b) => b.isFavorite).length;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentCount = bookmarks.filter((b) => new Date(b.createdAt) >= sevenDaysAgo).length;

  // Add bookmark
  const handleAddBookmark = useCallback(async (bookmark: {
    url: string;
    title: string;
    description?: string;
    thumbnail?: string;
    favicon?: string;
    categoryId: string;
    tags?: string[];
  }) => {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmark),
    });

    const result = await response.json();
    if (result.success) {
      // Fetch bookmarks to get the new bookmark
      await fetchBookmarks();

      // Optimistically update category bookmark count instead of refetching
      setCategories(prev =>
        prev.map((cat) =>
          cat._id.toString() === bookmark.categoryId
            ? ({ ...cat, bookmarkCount: cat.bookmarkCount + 1 } as ICategory & { bookmarkCount: number })
            : cat
        )
      );
    } else {
      throw new Error(result.error);
    }
  }, [fetchBookmarks]);

  // Delete bookmark
  const handleDeleteBookmark = useCallback(async (id: string) => {
    if (!confirm('이 북마크를 삭제하시겠습니까?')) return;

    // Find the bookmark to get its categoryId before deleting
    const bookmarkToDelete = bookmarks.find(b => b._id.toString() === id);
    if (!bookmarkToDelete) return;

    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        // Fetch bookmarks to remove the deleted bookmark
        await fetchBookmarks();

        // Optimistically update category bookmark count instead of refetching
        setCategories(prev =>
          prev.map((cat) =>
            cat._id.toString() === bookmarkToDelete.categoryId
              ? ({ ...cat, bookmarkCount: Math.max(0, cat.bookmarkCount - 1) } as ICategory & { bookmarkCount: number })
              : cat
          )
        );
      } else {
        alert('삭제에 실패했습니다');
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다');
    }
  }, [fetchBookmarks, bookmarks]);

  // Toggle favorite
  const handleToggleFavorite = useCallback(async (id: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchBookmarks();
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }, [fetchBookmarks]);

  // Edit bookmark
  const handleEditBookmark = useCallback((bookmark: IBookmark) => {
    setEditingBookmark(bookmark);
    setIsEditBookmarkModalOpen(true);
  }, []);

  // Update bookmark
  const handleUpdateBookmark = useCallback(async (id: string, data: {
    title: string;
    description?: string;
    categoryId: string;
    tags?: string[];
  }) => {
    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        await fetchBookmarks();

        // Update category counts if category changed
        const oldBookmark = bookmarks.find(b => b._id.toString() === id);
        if (oldBookmark && oldBookmark.categoryId !== data.categoryId) {
          await fetchCategories();
        }
      } else {
        alert('북마크 수정에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      alert('북마크 수정 중 오류가 발생했습니다');
    }
  }, [fetchBookmarks, fetchCategories, bookmarks]);

  // Open web preview
  const handleOpenPreview = useCallback((url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  }, []);

  // Open notes modal
  const handleOpenNotes = useCallback((bookmark: IBookmark) => {
    setNotesBookmark(bookmark);
    setIsNotesModalOpen(true);
  }, []);

  // Save notes
  const handleSaveNotes = useCallback(async (notes: string) => {
    if (!notesBookmark) return;

    try {
      console.log('Saving notes:', notes);
      const response = await fetch(`/api/bookmarks/${notesBookmark._id.toString()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const result = await response.json();
      console.log('Save response:', result);

      if (result.success) {
        await fetchBookmarks();
        // Update notesBookmark with the latest data
        setNotesBookmark(result.data);
        console.log('Updated bookmark with notes:', result.data.notes);
      } else {
        alert('메모 저장에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
      alert('메모 저장 중 오류가 발생했습니다');
    }
  }, [notesBookmark, fetchBookmarks]);

  // Add category
  const handleAddCategory = useCallback(async (category: { name: string; color: string }) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });

    const result = await response.json();
    if (result.success) {
      await fetchCategories();
    } else {
      throw new Error(result.error);
    }
  }, [fetchCategories]);

  // Delete category
  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    if (!confirm('이 컬렉션을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        await fetchCategories();
        // If the deleted category was selected, clear the selection
        if (selectedCategoryId === categoryId) {
          setSelectedCategoryId(null);
          setSelectedFilter('all');
        }
      } else {
        alert(result.error || '삭제에 실패했습니다');
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다');
    }
  }, [fetchCategories, selectedCategoryId]);

  // Handle filter selection
  const handleSelectFilter = useCallback((filter: 'all' | 'favorites' | 'recent') => {
    setSelectedFilter(filter);
    setSelectedCategoryId(null);
    setSelectedTag(null);
  }, []);

  // Handle category selection
  const handleSelectCategory = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedFilter(null);
    setSelectedTag(null);
  }, []);

  // Handle tag selection
  const handleSelectTag = useCallback((tag: string | null) => {
    setSelectedTag(tag);
    setSelectedFilter(null);
    setSelectedCategoryId(null);
  }, []);

  // Get display title
  const getDisplayTitle = useCallback(() => {
    if (selectedCategoryId) {
      const category = categories.find((cat) => cat._id.toString() === selectedCategoryId);
      return category?.name || '카테고리';
    }
    if (selectedFilter === 'favorites') return '즐겨찾기';
    if (selectedFilter === 'recent') return '최근 추가됨';
    if (selectedTag) return `#${selectedTag}`;
    return '모든 링크';
  }, [selectedCategoryId, selectedFilter, selectedTag, categories]);

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔖</div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen animated-gradient-bg">
      {/* Top Navigation */}
      <TopNavigation
        onAddBookmark={() => setIsAddBookmarkModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          bookmarks={bookmarks}
          selectedCategoryId={selectedCategoryId}
          selectedFilter={selectedFilter}
          selectedTag={selectedTag}
          allTags={allTags}
          onSelectCategory={handleSelectCategory}
          onSelectFilter={handleSelectFilter}
          onSelectTag={handleSelectTag}
          onAddCategory={() => setIsAddCategoryModalOpen(true)}
          onDeleteCategory={handleDeleteCategory}
          onOpenPreview={handleOpenPreview}
          totalBookmarks={bookmarks.length}
          favoritesCount={favoritesCount}
          recentCount={recentCount}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 md:p-10">
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="mb-8"
            />

            {/* Page Header with Filters */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                  {getDisplayTitle()}
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                  {filteredBookmarks.length}개의 링크
                </p>
              </div>

              <FilterControls
                timePeriod={timePeriod}
                sortBy={sortBy}
                onTimePeriodChange={setTimePeriod}
                onSortByChange={setSortBy}
              />
            </div>

            {/* Bookmarks List */}
            {loading ? (
              <EmptyState type="loading" />
            ) : filteredBookmarks.length === 0 ? (
              <EmptyState
                type={searchQuery ? 'no-results' : 'empty'}
                searchQuery={searchQuery}
              />
            ) : (
              <div className={viewMode === 'card' ? 'grid grid-cols-3 gap-6' : 'space-y-3'}>
                {filteredBookmarks.map((bookmark) => {
                  const category = categories.find((cat) => cat._id.toString() === bookmark.categoryId);
                  return viewMode === 'card' ? (
                    <BookmarkListItem
                      key={bookmark._id.toString()}
                      bookmark={bookmark}
                      category={category}
                      onDelete={handleDeleteBookmark}
                      onEdit={handleEditBookmark}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenPreview={handleOpenPreview}
                      onOpenNotes={handleOpenNotes}
                    />
                  ) : (
                    <BookmarkListViewItem
                      key={bookmark._id.toString()}
                      bookmark={bookmark}
                      category={category}
                      onDelete={handleDeleteBookmark}
                      onEdit={handleEditBookmark}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenPreview={handleOpenPreview}
                      onOpenNotes={handleOpenNotes}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isAddBookmarkModalOpen}
        onClose={() => setIsAddBookmarkModalOpen(false)}
        categories={categories}
        onAdd={handleAddBookmark}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAdd={handleAddCategory}
      />

      <EditBookmarkModal
        isOpen={isEditBookmarkModalOpen}
        onClose={() => {
          setIsEditBookmarkModalOpen(false);
          setEditingBookmark(null);
        }}
        bookmark={editingBookmark}
        categories={categories}
        onUpdate={handleUpdateBookmark}
      />

      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
          setNotesBookmark(null);
        }}
        onSave={handleSaveNotes}
        initialNotes={notesBookmark?.notes || ''}
        bookmarkTitle={notesBookmark?.title || ''}
      />

      {/* Web Preview Panel */}
      <WebPreviewPanel
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        url={previewUrl}
        title={previewTitle}
      />
    </div>
  );
}
