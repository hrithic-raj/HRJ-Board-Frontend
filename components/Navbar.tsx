'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Avatar from './Avatar';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <Link href="/projects" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white dark:bg-brand-500">
            H
          </span>
          <span className="hidden sm:inline">HRJ Board</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-700"
            >
              <Avatar user={user} size="sm" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-52 animate-slide-up rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
