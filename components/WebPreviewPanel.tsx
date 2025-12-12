'use client';

import React, { useEffect, useState } from 'react';

interface WebPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function WebPreviewPanel({ isOpen, onClose, url, title }: WebPreviewPanelProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setIsError(false);
      setIsLoading(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, url]);

  // 키보드 이벤트 핸들러 (ESC 키)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 새로고침 핸들러
  const handleRefresh = () => {
    setIsError(false);
    setIsLoading(true);
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative w-full max-w-7xl h-[90vh] flex flex-col bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header Section */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/30 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <IconGlobe className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">{title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">{url}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ActionButton onClick={handleRefresh} title="새로고침">
              <IconRefresh className="w-5 h-5" />
            </ActionButton>

            <ActionLink href={url} title="새 탭에서 열기">
              <IconExternalLink className="w-5 h-5" />
            </ActionLink>

            <ActionButton onClick={onClose} title="닫기 (ESC)" className="ml-2">
              <IconClose className="w-5 h-5" />
            </ActionButton>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 relative bg-white dark:bg-gray-900 w-full h-full">
          {/* 로딩 인디케이터 */}
          {isLoading && !isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          )}

          {/* 에러 상태 */}
          {isError ? (
            <ErrorState url={url} />
          ) : (
            <iframe
              id="preview-iframe"
              src={url}
              className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              title={title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setIsError(true);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* --- Sub Components --- */

interface ActionButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ActionButton = ({ onClick, title, children, className = '' }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className={`p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all hover:shadow-sm text-gray-600 dark:text-gray-400 ${className}`}
    title={title}
  >
    {children}
  </button>
);

interface ActionLinkProps {
  href: string;
  title: string;
  children: React.ReactNode;
}

const ActionLink = ({ href, title, children }: ActionLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all hover:shadow-sm text-gray-600 dark:text-gray-400"
    title={title}
  >
    {children}
  </a>
);

const ErrorState = ({ url }: { url: string }) => (
  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 text-center">
    <div>
      <div className="w-16 h-16 mx-auto mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
        <IconBan className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        미리보기를 표시할 수 없습니다
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        외부 사이트 보안 정책으로 인해 연결이 거부되었습니다.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-600/20"
      >
        새 탭에서 열기 <IconExternalLink className="w-4 h-4" />
      </a>
    </div>
  </div>
);

/* --- Icons --- */

const IconGlobe = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const IconRefresh = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconExternalLink = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const IconClose = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconBan = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
