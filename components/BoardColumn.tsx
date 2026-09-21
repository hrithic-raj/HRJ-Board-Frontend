'use client';

import { useState, useRef, useEffect } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Board, Item } from '@/types';
import ItemCard from './ItemCard';

interface BoardColumnProps {
  board: Board;
  index: number;
  items: Item[];
  onRename: (boardId: string, title: string) => void;
  onDelete: (board: Board) => void;
  onAddItem: (boardId: string) => void;
  onItemClick: (item: Item) => void;
}

export default function BoardColumn({
  board,
  index,
  items,
  onRename,
  onDelete,
  onAddItem,
  onItemClick,
}: BoardColumnProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(board.title);
  }, [board.title]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitRename = () => {
    setEditing(false);
    const trimmed = title.trim();
    if (trimmed && trimmed !== board.title) {
      onRename(board._id, trimmed);
    } else {
      setTitle(board.title);
    }
  };

  return (
    <Draggable draggableId={board._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex h-full w-[280px] shrink-0 flex-col rounded-xl bg-slate-100/80 sm:w-[300px]"
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-between gap-2 px-3 pb-2 pt-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: board.color }} />
              {editing ? (
                <input
                  ref={inputRef}
                  className="w-full rounded border border-brand-300 bg-white px-1.5 py-0.5 text-sm font-semibold text-slate-800 focus:outline-none"
                  value={title}
                  maxLength={80}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename();
                    if (e.key === 'Escape') {
                      setTitle(board.title);
                      setEditing(false);
                    }
                  }}
                />
              ) : (
                <h3
                  className="cursor-text truncate text-sm font-semibold text-slate-700"
                  onClick={() => setEditing(true)}
                  title="Click to rename"
                >
                  {board.title}
                </h3>
              )}
              <span className="shrink-0 rounded-full bg-slate-200 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                {items.length}
              </span>
            </div>

            <div className="relative shrink-0">
              <button
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                onClick={() => setMenuOpen((v) => !v)}
              >
                ⋯
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-slide-up">
                    <button
                      className="block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setMenuOpen(false);
                        setEditing(true);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      className="block w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(board);
                      }}
                    >
                      Delete board
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <Droppable droppableId={board._id} type="ITEM">
            {(dropProvided, dropSnapshot) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                className={`min-h-[40px] flex-1 overflow-y-auto scrollbar-hide px-2 pb-2 transition-colors ${
                  dropSnapshot.isDraggingOver ? 'bg-brand-50/60' : ''
                }`}
              >
                {items.map((item, idx) => (
                  <ItemCard key={item._id} item={item} index={idx} onClick={() => onItemClick(item)} />
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="px-2 pb-2">
            <button
              onClick={() => onAddItem(board._id)}
              className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-slate-500 hover:bg-slate-200/70 hover:text-slate-700"
            >
              + Add item
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
