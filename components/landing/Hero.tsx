import Link from 'next/link';

export default function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:flex-row lg:gap-16 lg:pb-24 lg:pt-20">
      <div className="flex-1 text-center lg:text-left">
        <p className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
          Free real-time kanban board
        </p>
        <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          HRJ Board — the real-time kanban board built for teams
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400 lg:mx-0">
          Plan projects, organize tasks on a drag-and-drop board, and keep everyone in sync. With
          HRJ Board, every change updates live for your whole team the moment it happens.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Link href="/register" className="btn-primary w-full !px-6 !py-3 text-base sm:w-auto">
            Get started free
          </Link>
          <Link href="/login" className="btn-secondary w-full !px-6 !py-3 text-base sm:w-auto">
            Log in
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">
          No credit card required · Set up a project in under a minute
        </p>
      </div>

      <div className="flex-1">
        <img
          src="/illustrations/hero-board.svg"
          alt="HRJ Board kanban board with To Do, In Progress and Done columns and draggable task cards"
          width={560}
          height={420}
          className="mx-auto w-full max-w-lg"
        />
      </div>
    </section>
  );
}
