'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Item } from '@/types';
import PriorityBadge from './PriorityBadge';
import Avatar from './Avatar';

const isOverdue = (dueDate?: string | null) => {
  if (!dueDate) return false;
  return new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
};

export default function ItemCard({
  item,
  index,
  onClick,
}: {
  item: Item;
  index: number;
  onClick: () => void;
}) {
  return (
    <Draggable draggableId={item._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`mb-2 cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
            snapshot.isDragging ? 'rotate-1 shadow-lg ring-2 ring-brand-300' : ''
          }`}
        >
          <p className="text-sm font-medium text-slate-800 break-words">{item.title}</p>

          {item.description && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500 break-words">{item.description}</p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <PriorityBadge priority={item.priority} />
              {item.dueDate && (
                <span
                  className={`text-[11px] ${
                    isOverdue(item.dueDate) ? 'font-medium text-red-600' : 'text-slate-400'
                  }`}
                >
                  {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
            {item.assignedTo && <Avatar user={item.assignedTo} size="sm" />}
          </div>
        </div>
      )}
    </Draggable>
  );
}
