import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-14 dark:from-brand-500 dark:to-brand-700 sm:px-12">
        <h2 className="text-3xl font-bold text-white">Ready to organize your team's work?</h2>
        <p className="mx-auto mt-3 max-w-md text-brand-100">
          Create your first project on HRJ Board in under a minute - it's free.
        </p>
        <Link
          href="/register"
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-brand-700 transition-colors hover:bg-brand-50"
        >
          Get started free
        </Link>
      </div>
    </section>
  );
}
