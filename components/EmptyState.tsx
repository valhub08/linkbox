'use client';

interface EmptyStateProps {
  type: 'loading' | 'empty' | 'no-results';
  searchQuery?: string;
  className?: string;
}

export default function EmptyState({ type, searchQuery, className = '' }: EmptyStateProps) {
  if (type === 'loading') {
    return (
      <div className={`text-center py-32 ${className}`}>
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">로딩 중...</p>
      </div>
    );
  }

  const title = searchQuery ? '검색 결과가 없습니다' : '아직 북마크가 없습니다';
  const description = searchQuery
    ? '다른 검색어를 시도해보세요'
    : '첫 북마크를 추가하고 정리를 시작하세요';

  return (
    <div className={`text-center py-32 ${className}`}>
      <div className="w-24 h-24 mx-auto mb-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/80 dark:border-gray-700/80 shadow-sm">
        <svg
          className="w-12 h-12 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
    </div>
  );
}
