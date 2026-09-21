import { User } from '@/types';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Avatar({
  user,
  size = 'md',
}: {
  user: Pick<User, 'name' | 'avatarColor'>;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims = size === 'sm' ? 'h-6 w-6 text-[10px]' : size === 'lg' ? 'h-11 w-11 text-base' : 'h-8 w-8 text-xs';

  return (
    <div
      title={user.name}
      className={`flex ${dims} shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-white`}
      style={{ backgroundColor: user.avatarColor || '#6366F1' }}
    >
      {getInitials(user.name || '?')}
    </div>
  );
}
