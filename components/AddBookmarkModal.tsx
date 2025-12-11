'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { ICategory } from '@/types';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ICategory[];
  onAdd: (bookmark: {
    url: string;
    title: string;
    description?: string;
    thumbnail?: string;
    favicon?: string;
    categoryId: string;
    tags?: string[];
  }) => Promise<void>;
}

export default function AddBookmarkModal({
  isOpen,
  onClose,
  categories,
  onAdd,
}: AddBookmarkModalProps) {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [favicon, setFavicon] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setUrl('');
        setTitle('');
        setDescription('');
        setThumbnail('');
        setFavicon('');
        setCategoryId('');
        setTags([]);
        setTagInput('');
      }, 300);
    }
  }, [isOpen]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, '');
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFetchMetadata = async () => {
    if (!url) {
      alert('URL을 입력해주세요');
      return;
    }

    setFetchingMetadata(true);
    try {
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success) {
        setTitle(result.data.title || '');
        setDescription(result.data.description || '');
        setThumbnail(result.data.thumbnail || '');
        setFavicon(result.data.favicon || '');
        setStep(2);
      } else {
        // Fallback
        try {
          const urlObj = new URL(url);
          const domainName = urlObj.hostname.replace('www.', '');
          setTitle(domainName);
          setFavicon(`https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`);
          setStep(2);
        } catch {
          alert('유효한 URL을 입력해주세요');
        }
      }
    } catch (error) {
      try {
        const urlObj = new URL(url);
        const domainName = urlObj.hostname.replace('www.', '');
        setTitle(domainName);
        setFavicon(`https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`);
        setStep(2);
      } catch {
        alert('유효한 URL을 입력해주세요');
      }
    } finally {
      setFetchingMetadata(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !title || !categoryId) {
      alert('URL, 제목, 카테고리를 입력해주세요');
      return;
    }

    let finalTags = [...tags];
    if (tagInput.trim()) {
      const pendingTag = tagInput.trim().replace(/^#/, '');
      if (pendingTag && !finalTags.includes(pendingTag)) {
        finalTags.push(pendingTag);
      }
    }

    setLoading(true);
    try {
      await onAdd({
        url,
        title,
        description,
        thumbnail,
        favicon,
        categoryId,
        tags: finalTags,
      });
      onClose();
    } catch (error) {
      alert('북마크 추가에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-6">
        {/* Header with progress */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            새 링크 추가
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 1 ? 'bg-blue-600 text-white scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {step > 1 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : '1'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">URL 입력</span>
            </div>
            <div className={`w-12 h-0.5 transition-all ${step >= 2 ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 2 ? 'bg-blue-600 text-white scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">상세 정보</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: URL Input */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleFetchMetadata();
                    }
                  }}
                  placeholder="https://example.com"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                  required
                  autoFocus
                />
              </div>
              <Button
                type="button"
                onClick={handleFetchMetadata}
                disabled={fetchingMetadata || !url}
                className="w-full py-4 text-base font-semibold rounded-2xl"
              >
                {fetchingMetadata ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    정보 가져오는 중...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    다음 단계
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              {/* Preview Card */}
              {(thumbnail || favicon) && (
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl">
                  {thumbnail && (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <img
                        src={thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {favicon && (
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <img src={favicon} alt="Favicon" className="w-8 h-8 rounded" />
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  제목 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="북마크 제목"
                  className="w-full px-4 py-3 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="북마크에 대한 간단한 설명..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl text-gray-900 dark:text-gray-100 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  카테고리 *
                </label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((cat) => (
                      <option key={cat._id.toString()} value={cat._id.toString()}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  태그
                </label>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium backdrop-blur-xl"
                      >
                        <span className="text-blue-400">#</span>
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="태그 입력 후 Enter 또는 쉼표"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl font-semibold"
                >
                  뒤로
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      추가 중...
                    </span>
                  ) : (
                    '추가'
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </Modal>
  );
}
