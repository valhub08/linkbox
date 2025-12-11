'use client';

import React from 'react';
import Image from 'next/image';
import { IBookmark, ICategory } from '@/types';

interface BookmarkListViewItemProps {
  bookmark: IBookmark;
  category?: ICategory;
  onDelete: (id: string) => void;
  onEdit: (bookmark: IBookmark) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onOpenPreview: (url: string, title: string) => void;
}

export default function BookmarkListViewItem({
  bookmark,
  category,
  onDelete,
  onEdit,
  onToggleFavorite,
  onOpenPreview,
}: BookmarkListViewItemProps) {
  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주일 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;

    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <div className="group bg-[#FFFFFF]/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-2xl border border-[#FFFFFF]/40 dark:border-gray-700/40 hover:border-[#FFFFFF] dark:hover:border-gray-600 hover:shadow-md hover:shadow-gray-200/30 dark:hover:shadow-gray-900/30 transition-all duration-300 overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        {/* Favicon */}
        <button
          onClick={() => onOpenPreview(bookmark.url, bookmark.title)}
          className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl overflow-hidden relative border border-white/60 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer flex items-center justify-center"
        >
          {bookmark.favicon ? (
            <Image
              src={bookmark.favicon}
              alt=""
              width={24}
              height={24}
              className="object-contain"
              unoptimized
            />
          ) : (
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onOpenPreview(bookmark.url, bookmark.title)}
            className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 text-left w-full mb-1"
          >
            {bookmark.title}
          </button>
          {bookmark.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 leading-relaxed">
              {bookmark.description}
            </p>
          )}
        </div>

        {/* Tags and Category */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {bookmark.tags && bookmark.tags.length > 0 && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-700">
              #{bookmark.tags[0]}
              {bookmark.tags.length > 1 && ` +${bookmark.tags.length - 1}`}
            </span>
          )}

          {category && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
              style={{
                backgroundColor: `${category.color}20`,
                borderColor: `${category.color}40`,
                color: category.color,
                border: `1px solid ${category.color}40`
              }}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              {category.name}
            </div>
          )}
        </div>

        {/* Date */}
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium flex-shrink-0">
          {formatDate(bookmark.createdAt)}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(bookmark._id, !bookmark.isFavorite)}
            className={`p-2 rounded-lg transition-all ${
              bookmark.isFavorite
                ? 'bg-yellow-100/80 hover:bg-yellow-200/80'
                : 'hover:bg-white/60'
            }`}
            title={bookmark.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <svg
              className={`w-4 h-4 ${
                bookmark.isFavorite
                  ? 'fill-yellow-500 stroke-yellow-500'
                  : 'fill-none stroke-gray-400'
              }`}
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
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(bookmark)}
            className="p-2 rounded-lg hover:bg-white/60 transition-all"
            title="편집"
          >
            <svg
              className="w-4 h-4 text-gray-500 hover:text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(bookmark._id)}
            className="p-2 rounded-lg hover:bg-red-100/80 transition-all"
            title="삭제"
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
      </div>
    </div>
  );
}
