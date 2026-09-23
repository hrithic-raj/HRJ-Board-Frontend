import { Zap, MousePointerClick, UsersRound, Flag, Moon, ClipboardCopy } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-time sync',
    description:
      'Every board and card update streams instantly to your whole team over WebSockets - no refresh needed.',
  },
  {
    icon: MousePointerClick,
    title: 'Drag-and-drop boards',
    description:
      'Reorder cards, move them between columns, and rearrange boards with smooth, native-feeling drag and drop.',
  },
  {
    icon: UsersRound,
    title: 'Invite your team in one click',
    description: 'Share a single link. Teammates sign up (or log in) and land straight on the project board.',
  },
  {
    icon: Flag,
    title: 'Priorities & due dates',
    description: 'Flag urgent work, assign an owner, and track deadlines without leaving the board.',
  },
  {
    icon: Moon,
    title: 'Light & dark mode',
    description: 'A clean interface that adapts to your system theme, or switch manually anytime.',
  },
  {
    icon: ClipboardCopy,
    title: 'Export to Google Sheets',
    description: 'Copy your entire board as a table with one click and paste it straight into Sheets or Excel.',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Everything your team needs to stay organized
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            HRJ Board keeps project planning simple - no clutter, no learning curve, just a fast, shared
            board your whole team can trust.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <Icon size={20} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
