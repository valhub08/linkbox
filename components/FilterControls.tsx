'use client';

import Dropdown from './Dropdown';

type TimePeriod = 'all' | 'today' | 'week' | 'month' | 'year';
type SortBy = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

interface FilterControlsProps {
  timePeriod: TimePeriod;
  sortBy: SortBy;
  onTimePeriodChange: (value: TimePeriod) => void;
  onSortByChange: (value: SortBy) => void;
  className?: string;
}

const timePeriodOptions = [
  { value: 'all' as const, label: '시간대: 전체' },
  { value: 'today' as const, label: '시간대: 오늘' },
  { value: 'week' as const, label: '시간대: 이번 주' },
  { value: 'month' as const, label: '시간대: 이번 달' },
  { value: 'year' as const, label: '시간대: 올해' },
];

const sortByOptions = [
  { value: 'newest' as const, label: '정렬: 최신순' },
  { value: 'oldest' as const, label: '정렬: 오래된순' },
  { value: 'title-asc' as const, label: '정렬: 제목 (가나다순)' },
  { value: 'title-desc' as const, label: '정렬: 제목 (가나다 역순)' },
];

export default function FilterControls({
  timePeriod,
  sortBy,
  onTimePeriodChange,
  onSortByChange,
  className = '',
}: FilterControlsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Dropdown
        value={timePeriod}
        options={timePeriodOptions}
        onChange={onTimePeriodChange}
      />
      <Dropdown
        value={sortBy}
        options={sortByOptions}
        onChange={onSortByChange}
      />
    </div>
  );
}
