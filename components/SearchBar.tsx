'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = '저장된 링크, 태그 또는 컬렉션 검색...',
  className = '',
}: SearchBarProps) {
  return (
    <div className={`relative group ${className}`}>
      <svg
        className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-blue-500"
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-14 pr-6 py-4 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/50 focus:bg-white/60 dark:focus:bg-gray-800/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 shadow-sm hover:shadow-md hover:border-white/60 dark:hover:border-gray-600/60"
      />
    </div>
  );
}
