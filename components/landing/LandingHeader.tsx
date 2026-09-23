'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white dark:bg-brand-500">
            H
          </span>
          HRJ Board
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex"
        >
          <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400">
            How it works
          </a>
          <a href="#faq" className="hover:text-brand-600 dark:hover:text-brand-400">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/projects" className="btn-primary !py-1.5 text-sm">
              Go to my projects
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden !py-1.5 text-sm sm:inline-flex">
                Log in
              </Link>
              <Link href="/register" className="btn-primary !py-1.5 text-sm">
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
