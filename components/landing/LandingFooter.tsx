import Link from 'next/link';

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 py-10 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white dark:bg-brand-500">
            H
          </span>
          HRJ Board
        </div>
        <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
          A free, real-time kanban board for teams to plan, track and collaborate on projects together.
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400"
        >
          <Link href="/register" className="hover:text-brand-600 dark:hover:text-brand-400">
            Sign up
          </Link>
          <Link href="/login" className="hover:text-brand-600 dark:hover:text-brand-400">
            Log in
          </Link>
          <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400">
            Features
          </a>
          <a href="#faq" className="hover:text-brand-600 dark:hover:text-brand-400">
            FAQ
          </a>
        </nav>
        <p className="text-xs text-slate-400 dark:text-slate-600">© {year} HRJ Board. All rights reserved.</p>
      </div>
    </footer>
  );
}
