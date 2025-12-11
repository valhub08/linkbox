'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

interface TopNavigationProps {
  onAddBookmark: () => void;
  activeTab: 'home' | 'explore' | 'mylinks';
  onTabChange: (tab: 'home' | 'explore' | 'mylinks') => void;
}

export default function TopNavigation({ onAddBookmark, activeTab, onTabChange }: TopNavigationProps) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="relative z-40 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border-b border-white/30 dark:border-gray-800/30">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Tabs */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/linkbox-logo-transparent.png"
                alt="LinkBox Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="text-xl font-bold text-[#2563EB] dark:text-blue-400 tracking-tight">LinkBox</span>
            </button>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-2">
              <button
                onClick={() => onTabChange('home')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'home'
                    ? 'bg-blue-100/70 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                홈
              </button>
              <button
                onClick={() => onTabChange('explore')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'explore'
                    ? 'bg-blue-100/70 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                탐색
              </button>
              <button
                onClick={() => onTabChange('mylinks')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'mylinks'
                    ? 'bg-blue-100/70 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                내 링크
              </button>
            </nav>
          </div>

          {/* Right: Actions and User Info */}
          <div className="flex items-center gap-3">
            {/* Add Link Button */}
            <button
              onClick={onAddBookmark}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:backdrop-blur-xl text-white text-sm font-semibold rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-l hover:shadow-blue-600/40"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              새 링크 추가
            </button>

            {/* Notification Bell */}
            <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-all">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* User Profile */}
            {session?.user && (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full ring-2 ring-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {session.user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF]/40 dark:bg-gray-800/90 backdrop-blur-2xl rounded-2xl shadow-xl border border-[#FFFFFF]/40 dark:border-gray-700/40 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
                  <div className="px-4 py-3 border-b border-white/30 dark:border-gray-700/30">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {session.user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/profile')}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors font-medium"
                  >
                    프로필 보기
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors font-medium"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
