import { ItemPriority } from '@/types';

const STYLES: Record<ItemPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

const LABELS: Record<ItemPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export default function PriorityBadge({ priority }: { priority: ItemPriority }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STYLES[priority]}`}>
      {LABELS[priority]}
    </span>
  );
}
