'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: { name: string; color: string }) => Promise<void>;
}

const PRESET_COLORS = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6B7280', // gray
];

export default function AddCategoryModal({ isOpen, onClose, onAdd }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      alert('카테고리 이름을 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      await onAdd({ name, color });
      setName('');
      setColor(PRESET_COLORS[0]);
      onClose();
    } catch (error) {
      alert('카테고리 추가에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="카테고리 추가">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="카테고리 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: UI 디자인"
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            색상
          </label>
          <div className="flex gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                onClick={() => setColor(presetColor)}
                className={`w-10 h-10 rounded-full transition-transform ${
                  color === presetColor ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                }`}
                style={{ backgroundColor: presetColor }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? '추가 중...' : '추가'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
