'use client';

import React, { useEffect, useState } from 'react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  initialNotes: string;
  bookmarkTitle: string;
}

export default function NotesModal({
  isOpen,
  onClose,
  onSave,
  initialNotes,
  bookmarkTitle,
}: NotesModalProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(notes);
      onClose();
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-lg shadow-xl max-w-2xl w-full mx-4 border border-white/30 dark:border-gray-700/30">
        {/* Header */}
        <ModalHeader title={bookmarkTitle} onClose={onClose} />

        {/* Content */}
        <div className="p-6">
          <label
            htmlFor="notes-textarea"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            메모
          </label>
          <textarea
            id="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="이 링크에 대한 메모를 입력하세요... (예: 로그인 정보, 읽은 위치, 참고사항 등)"
            className="w-full h-64 px-4 py-3 bg-white/60 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 resize-none"
            maxLength={5000}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {notes.length} / 5000 characters
          </p>
        </div>

        {/* Footer */}
        <ModalFooter
          onCancel={onClose}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}

/* --- Sub Components --- */

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader = ({ title, onClose }: ModalHeaderProps) => (
  <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-2">
      <IconNotes className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        메모 편집
      </h2>
    </div>
    <button
      onClick={onClose}
      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      title="닫기"
    >
      <IconClose className="w-6 h-6" />
    </button>
  </header>
);

interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const ModalFooter = ({ onCancel, onSave, isSaving }: ModalFooterProps) => (
  <footer className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
    <ActionButton
      onClick={onCancel}
      variant="secondary"
      disabled={isSaving}
    >
      취소
    </ActionButton>
    <ActionButton
      onClick={onSave}
      variant="primary"
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <IconSpinner className="w-4 h-4 animate-spin" />
          저장 중...
        </>
      ) : (
        <>
          <IconSave className="w-4 h-4" />
          저장
        </>
      )}
    </ActionButton>
  </footer>
);

interface ActionButtonProps {
  onClick: () => void;
  variant: 'primary' | 'secondary';
  disabled?: boolean;
  children: React.ReactNode;
}

const ActionButton = ({ onClick, variant, disabled, children }: ActionButtonProps) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2";
  const variantClasses = variant === 'primary'
    ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed"
    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </button>
  );
};

/* --- Icons --- */

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

const IconClose = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const IconSave = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const IconSpinner = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
