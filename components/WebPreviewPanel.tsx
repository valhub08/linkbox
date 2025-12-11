'use client';

import React, { useEffect, useState } from 'react';

interface WebPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function WebPreviewPanel({ isOpen, onClose, url, title }: WebPreviewPanelProps) {
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setIframeError(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Preview Container */}
      <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] border border-white/30 dark:border-gray-700/30 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">{title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">{url}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              onClick={() => {
                setIframeError(false);
                const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
                if (iframe) iframe.src = iframe.src;
              }}
              className="p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all hover:shadow-sm"
              title="새로고침"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Open in new tab */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all hover:shadow-sm"
              title="새 탭에서 열기"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all hover:shadow-sm ml-2"
              title="닫기 (ESC)"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - iframe */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-b-3xl overflow-hidden relative">
          {iframeError ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <div className="text-center px-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                  <svg
                    className="w-10 h-10 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  미리보기를 표시할 수 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  이 웹사이트는 외부 사이트에서의 표시를 차단했습니다.<br />
                  새 탭에서 열어주세요.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium shadow-lg shadow-blue-600/30 dark:shadow-blue-500/30"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  새 탭에서 열기
                </a>
              </div>
            </div>
          ) : (
            <iframe
              id="preview-iframe"
              src={url}
              className="w-full h-full border-0"
              title={title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              onError={() => setIframeError(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
