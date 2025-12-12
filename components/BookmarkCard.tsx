'use client';

import React from 'react';
import Image from 'next/image';
import { IBookmark } from '@/types';

interface BookmarkCardProps {
  bookmark: IBookmark;
  onDelete: (id: string) => void;
  onEdit: (bookmark: IBookmark) => void;
  onOpenNotes: (bookmark: IBookmark) => void;
}

const IconLink = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

const IconEdit = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const IconDelete = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const IconNotes = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const extractDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
};

const EmptyThumbnail = ({ favicon }: { favicon?: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
    {favicon ? (
      <div className="relative w-16 h-16 mb-2">
        <Image src={favicon} alt="" fill className="object-contain" unoptimized />
      </div>
    ) : (
      <IconLink className="w-12 h-12" />
    )}
  </div>
);

const DomainBadge = ({ domain, favicon }: { domain: string; favicon?: string }) => (
  <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-md flex items-center gap-1.5">
    {favicon && (
      <Image
        src={favicon}
        alt=""
        width={14}
        height={14}
        className="flex-shrink-0"
        unoptimized
      />
    )}
    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
      {domain}
    </span>
  </div>
);

const ThumbnailSection = ({ bookmark }: { bookmark: IBookmark }) => {
  const domain = extractDomain(bookmark.url);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
    >
      {bookmark.thumbnail ? (
        <Image
          src={bookmark.thumbnail}
          alt={bookmark.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          unoptimized
        />
      ) : (
        <EmptyThumbnail favicon={bookmark.favicon} />
      )}
      <DomainBadge domain={domain} favicon={bookmark.favicon} />
    </a>
  );
};

const ContentSection = ({
  bookmark,
  onEdit,
  onDelete,
  onOpenNotes
}: {
  bookmark: IBookmark;
  onEdit: (bookmark: IBookmark) => void;
  onDelete: (id: string) => void;
  onOpenNotes: (bookmark: IBookmark) => void;
}) => (
  <div className="p-4">
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 mb-2 transition-colors"
    >
      {bookmark.title}
    </a>

    {bookmark.description && (
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
        {bookmark.description}
      </p>
    )}

    <div className="flex gap-2">
      <button
        onClick={() => onEdit(bookmark)}
        className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-1.5"
      >
        <IconEdit className="w-4 h-4" />
        편집
      </button>
      <button
        onClick={() => onOpenNotes(bookmark)}
        className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
        title="메모"
      >
        <IconNotes className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(bookmark._id.toString())}
        className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors"
      >
        <IconDelete className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default function BookmarkCard({ bookmark, onDelete, onEdit, onOpenNotes }: BookmarkCardProps) {
  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200 overflow-hidden hover:-translate-y-1">
      <ThumbnailSection bookmark={bookmark} />
      <ContentSection bookmark={bookmark} onEdit={onEdit} onDelete={onDelete} onOpenNotes={onOpenNotes} />
    </article>
  );
}
