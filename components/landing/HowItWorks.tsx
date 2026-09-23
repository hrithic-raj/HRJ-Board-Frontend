const STEPS = [
  {
    n: '1',
    title: 'Create a project',
    description:
      'Sign up and create a project - HRJ Board sets you up with a ready-made To Do / In Progress / Done board instantly.',
  },
  {
    n: '2',
    title: 'Customize your board',
    description:
      'Add boards and cards, set priorities and due dates, and rename columns to match how your team works.',
  },
  {
    n: '3',
    title: 'Invite your team',
    description: 'Share your invite link. Teammates join in seconds and every change syncs live for everyone.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Get started in three simple steps
            </h2>
            <ol className="mt-8 space-y-6">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white dark:bg-brand-500">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{s.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <img
            src="/illustrations/realtime-sync.svg"
            alt="Illustration of HRJ Board syncing task updates live across two teammates' screens"
            width={520}
            height={400}
            className="mx-auto w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
