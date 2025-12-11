'use client';

import React, { useState } from 'react';
import { ICategory, IBookmark } from '@/types';

interface SidebarProps {
  categories: (ICategory & { bookmarkCount: number })[];
  bookmarks: IBookmark[];
  selectedCategoryId: string | null;
  selectedFilter: 'all' | 'favorites' | 'recent' | null;
  selectedTag: string | null;
  allTags: { tag: string; count: number }[];
  onSelectCategory: (categoryId: string | null) => void;
  onSelectFilter: (filter: 'all' | 'favorites' | 'recent') => void;
  onSelectTag: (tag: string | null) => void;
  onAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onOpenPreview?: (url: string, title: string) => void;
  totalBookmarks: number;
  favoritesCount: number;
  recentCount: number;
}

export default function Sidebar({
  categories,
  bookmarks,
  selectedCategoryId,
  selectedFilter,
  selectedTag,
  allTags,
  onSelectCategory,
  onSelectFilter,
  onSelectTag,
  onAddCategory,
  onDeleteCategory,
  onOpenPreview,
  totalBookmarks,
  favoritesCount,
  recentCount,
}: SidebarProps) {
  const [tagSearch, setTagSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredTags = allTags.filter(({ tag }) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="w-72 h-full overflow-y-auto flex flex-col p-5 space-y-4">
      {/* 필터 Title */}
      <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 px-1 mb-1">필터</h2>

      {/* 빠른 검색 Section - Separate Card */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-2xl p-4 shadow-sm border border-white/30 dark:border-gray-700/30">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 tracking-tight">
            빠른 검색
          </h3>
          <div className="space-y-1">
            {/* 모든 링크 */}
            <button
              onClick={() => onSelectFilter('all')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                selectedFilter === 'all'
                  ? 'bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="flex-1 text-left text-sm font-medium">모든 링크</span>
              {totalBookmarks > 0 && (
                <span className="text-xs bg-gray-200/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  {totalBookmarks}
                </span>
              )}
            </button>

            {/* 즐겨찾기 */}
            <button
              onClick={() => onSelectFilter('favorites')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                selectedFilter === 'favorites'
                  ? 'bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span className="flex-1 text-left text-sm font-medium">즐겨찾기</span>
              {favoritesCount > 0 && (
                <span className="text-xs bg-gray-200/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* 최근 추가됨 */}
            <button
              onClick={() => onSelectFilter('recent')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                selectedFilter === 'recent'
                  ? 'bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="flex-1 text-left text-sm font-medium">최근 추가됨</span>
              {recentCount > 0 && (
                <span className="text-xs bg-gray-200/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  {recentCount}
                </span>
              )}
            </button>
          </div>
      </div>

      {/* 컬렉션 Section - Separate Card */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-2xl p-4 shadow-sm border border-white/30 dark:border-gray-700/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">
              컬렉션
            </h3>
            <button
              onClick={onAddCategory}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              title="새 컬렉션"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-1">
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category._id.toString());
              const categoryBookmarks = bookmarks.filter(b => b.categoryId === category._id.toString());

              return (
              <div key={category._id.toString()} className="group/category">
                <div className="relative flex items-center">
                  {/* Chevron button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(category._id.toString());
                    }}
                    className="p-1 hover:bg-gray-100/50 rounded transition-colors"
                  >
                    <svg
                      className={`w-3.5 h-3.5 flex-shrink-0 text-gray-500 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Category button */}
                  <button
                    onClick={() => onSelectCategory(category._id.toString())}
                    className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                      selectedCategoryId === category._id.toString()
                        ? 'bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: category.color || '#6B7280' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span className="flex-1 text-left text-sm font-medium truncate">
                    {category.name}
                  </span>
                  {category.bookmarkCount > 0 && (
                    <span className="text-xs bg-gray-200/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full transition-opacity group-hover/category:opacity-0">
                      {category.bookmarkCount}
                    </span>
                  )}
                </button>
                {/* Delete button - shown on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category._id.toString());
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover/category:opacity-100 hover:bg-red-50 transition-all"
                  title="컬렉션 삭제"
                >
                  <svg
                    className="w-4 h-4 text-gray-500 hover:text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                </div>

                {/* Expanded bookmarks */}
                {isExpanded && categoryBookmarks.length > 0 && (
                  <div className="ml-8 mt-1 space-y-1">
                    {categoryBookmarks.map((bookmark) => (
                      <button
                        key={bookmark._id}
                        onClick={() => onOpenPreview?.(bookmark.url, bookmark.title)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 transition-all group/bookmark text-left"
                      >
                        <svg
                          className="w-3 h-3 text-gray-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        <span className="text-xs truncate">{bookmark.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              );
            })}

            {categories.length === 0 && (
              <div className="py-6 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  컬렉션이 없습니다
                </p>
                <button
                  onClick={onAddCategory}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  첫 컬렉션 만들기
                </button>
              </div>
            )}
          </div>
      </div>

      {/* 태그 Section - Separate Card */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-2xl p-4 shadow-sm border border-white/30 dark:border-gray-700/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">
              태그
            </h3>
            <button
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              title="새 필렉션"
            >
              + 새 필렉션
            </button>
          </div>

          <div className="hidden">
            <button
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors"
              title="새 태그"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {/* Tag Search */}
          <div className="mb-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="태그 검색..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/40 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all"
              />
            </div>
          </div>

          {/* Tag List */}
          <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
            {filteredTags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedTag === tag
                    ? 'bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                    : 'bg-gray-100/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-600/70'
                }`}
              >
                <span>#{tag}</span>
                <span className="text-xs opacity-60">({count})</span>
              </button>
            ))}

            {allTags.length === 0 && (
              <div className="w-full py-6 text-center">
                <p className="text-sm text-gray-500">태그가 없습니다</p>
              </div>
            )}

            {allTags.length > 0 && filteredTags.length === 0 && (
              <div className="w-full py-6 text-center">
                <p className="text-sm text-gray-500">
                  검색 결과가 없습니다
                </p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
