import { User } from '@/types';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Avatar({
  user,
  size = 'md',
  online,
}: {
  user: Pick<User, 'name' | 'avatarColor'>;
  size?: 'sm' | 'md' | 'lg';
  /** When set (true/false), renders a small presence dot in the corner. */
  online?: boolean;
}) {
  const dims = size === 'sm' ? 'h-6 w-6 text-[10px]' : size === 'lg' ? 'h-11 w-11 text-base' : 'h-8 w-8 text-xs';
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2.5 w-2.5';

  return (
    <div className="relative inline-flex shrink-0">
      <div
        title={user.name}
        className={`flex ${dims} shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-white dark:ring-slate-900`}
        style={{ backgroundColor: user.avatarColor || '#6366F1' }}
      >
        {getInitials(user.name || '?')}
      </div>
      {online !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${dotSize} rounded-full ring-2 ring-white dark:ring-slate-900 ${
            online ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        />
      )}
    </div>
  );
}
