import { ItemPriority } from '@/types';

const STYLES: Record<ItemPriority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
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
