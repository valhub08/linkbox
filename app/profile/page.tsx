'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TopNavigation from '@/components/TopNavigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('viewMode') as 'card' | 'list' | null;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('light');
    }
  }, []);

  // Apply theme to document
  const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
    if (selectedTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Save view mode to localStorage
  const handleViewModeChange = (mode: 'card' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  // Handle theme change
  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    applyTheme(selectedTheme);
  };

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔖</div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    router.push('/auth/signin');
    return null;
  }

  // Check if user is OAuth (Google login)
  const isOAuthUser = session.user.email && !session.user.name?.includes('credentials');

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    if (!confirm('모든 북마크와 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까?')) {
      return;
    }

    try {
      // TODO: 계정 삭제 API 호출
      alert('계정 삭제 기능은 곧 구현 예정입니다.');
    } catch (error) {
      alert('계정 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col h-screen animated-gradient-bg">
      <TopNavigation
        onAddBookmark={() => {}}
        activeTab="home"
        onTabChange={() => {}}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-10">
          {/* Page Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 tracking-tight">
            내 계정
          </h1>

          {/* Profile Section */}
          <div className="bg-[#FFFFFF]/50 dark:bg-gray-800/50 backdrop-blur-2xl rounded-3xl border border-[#FFFFFF]/50 dark:border-gray-700/50 p-8 mb-6 shadow-sm">
            <div className="flex items-start gap-6 mb-6">
              {/* Profile Image */}
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={80}
                  height={80}
                  className="rounded-full ring-4 ring-gray-200"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center ring-4 ring-gray-200">
                  <span className="text-2xl font-semibold text-white">
                    {session.user.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {session.user.name || 'User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditingProfile(true)}
                className={`px-5 py-3 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 font-semibold transition-all hover:shadow-md ${isOAuthUser ? 'w-full' : 'flex-1'}`}
              >
                프로필 수정
              </button>
              {!isOAuthUser && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex-1 px-5 py-3 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 font-semibold transition-all hover:shadow-md"
                >
                  비밀번호 변경
                </button>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-[#FFFFFF]/50 dark:bg-gray-800/50 backdrop-blur-2xl rounded-3xl border border-[#FFFFFF]/50 dark:border-gray-700/50 p-8 mb-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">알림 설정</h3>

            <div className="space-y-4">
              {/* Email Notification */}
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-100 font-medium">이메일 알림</span>
                <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform translate-x-7 shadow-md" />
                </button>
              </div>

              {/* Push Notification */}
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-100 font-medium">푸시 알림</span>
                <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 transition-colors">
                  <span className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform translate-x-1 shadow-md" />
                </button>
              </div>
            </div>
          </div>

          {/* Theme & Layout Settings */}
          <div className="bg-[#FFFFFF]/50 dark:bg-gray-800/50 backdrop-blur-2xl rounded-3xl border border-[#FFFFFF]/50 dark:border-gray-700/50 p-8 mb-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">테마 & 레이아웃 환경설정</h3>

            {/* Theme Selector */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                라이트
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                다크
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  theme === 'system'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                시스템 설정
              </button>
            </div>

            {/* View Mode Selector */}
            <div className="grid grid-cols-2 gap-4">
              {/* Card View */}
              <button
                onClick={() => handleViewModeChange('card')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  viewMode === 'card'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/30'
                    : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="mb-4">
                  <svg
                    className="w-full h-20 text-gray-400"
                    fill="none"
                    viewBox="0 0 200 80"
                  >
                    <rect x="10" y="10" width="80" height="60" rx="8" fill="currentColor" opacity="0.3" />
                    <rect x="110" y="10" width="80" height="60" rx="8" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>
                <p className="text-center font-semibold text-gray-900 dark:text-gray-100">카드 보기</p>
              </button>

              {/* List View */}
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  viewMode === 'list'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/30'
                    : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="mb-4">
                  <svg
                    className="w-full h-20 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 200 80"
                  >
                    <rect x="10" y="10" width="20" height="20" rx="4" fill="currentColor" opacity="0.3" />
                    <rect x="40" y="12" width="150" height="4" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="40" y="22" width="100" height="4" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="10" y="45" width="20" height="20" rx="4" fill="currentColor" opacity="0.3" />
                    <rect x="40" y="47" width="150" height="4" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="40" y="57" width="100" height="4" rx="2" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>
                <p className="text-center font-semibold text-gray-900 dark:text-gray-100">목록 보기</p>
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="bg-[#FFFFFF]/50 dark:bg-gray-800/50 backdrop-blur-2xl rounded-3xl border border-red-200/50 dark:border-red-900/50 p-8 shadow-sm">
            <button
              onClick={handleDeleteAccount}
              className="w-full px-5 py-3 bg-white/80 dark:bg-gray-700/80 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-red-600 dark:text-red-400 font-semibold transition-all hover:shadow-md"
            >
              계정 삭제
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditingProfile(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">프로필 수정</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  defaultValue={session.user.name || ''}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                  <span className="text-xs text-gray-500 ml-2">(변경 불가)</span>
                </label>
                <input
                  type="email"
                  defaultValue={session.user.email || ''}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-900 font-semibold transition-all"
              >
                취소
              </button>
              <button
                onClick={() => {
                  // TODO: 프로필 수정 API 호출
                  alert('프로필 수정 기능은 곧 구현 예정입니다.');
                  setIsEditingProfile(false);
                }}
                className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition-all shadow-lg"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsChangingPassword(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">비밀번호 변경</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">현재 비밀번호</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsChangingPassword(false)}
                className="flex-1 px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-900 font-semibold transition-all"
              >
                취소
              </button>
              <button
                onClick={() => {
                  // TODO: 비밀번호 변경 API 호출
                  alert('비밀번호 변경 기능은 곧 구현 예정입니다.');
                  setIsChangingPassword(false);
                }}
                className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition-all shadow-lg"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
