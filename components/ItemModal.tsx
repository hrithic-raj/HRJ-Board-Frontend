'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '@/lib/api';
import { Item, ItemPriority, ProjectMember } from '@/types';
import ConfirmDialog from './ConfirmDialog';
import Avatar from './Avatar';

interface ItemModalProps {
  mode: 'create' | 'edit';
  projectId: string;
  boardId: string;
  item?: Item;
  members: ProjectMember[];
  onClose: () => void;
  onSaved: (item: Item) => void;
  onDeleted: (itemId: string, boardId: string) => void;
}

export default function ItemModal({
  mode,
  projectId,
  boardId,
  item,
  members,
  onClose,
  onSaved,
  onDeleted,
}: ItemModalProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [priority, setPriority] = useState<ItemPriority>(item?.priority || 'medium');
  const [assignedTo, setAssignedTo] = useState(item?.assignedTo?._id || item?.assignedTo?.id || '');
  const [dueDate, setDueDate] = useState(item?.dueDate ? item.dueDate.substring(0, 10) : '');
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      if (mode === 'create') {
        const { data } = await api.post('/items', {
          project: projectId,
          board: boardId,
          title,
          description,
          priority,
          assignedTo: assignedTo || null,
          dueDate: dueDate || null,
        });
        onSaved(data.item);
        toast.success('Item added');
      } else if (item) {
        const { data } = await api.put(`/items/${item._id}`, {
          title,
          description,
          priority,
          assignedTo: assignedTo || null,
          dueDate: dueDate || null,
        });
        onSaved(data.item);
        toast.success('Item updated');
      }
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    try {
      await api.delete(`/items/${item._id}`);
      onDeleted(item._id, item.board);
      toast.success('Item deleted');
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {mode === 'create' ? 'New item' : 'Edit item'}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="label" htmlFor="ititle">
              Title
            </label>
            <input
              id="ititle"
              className="input"
              placeholder="e.g. Design the login screen"
              value={title}
              maxLength={150}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="idesc">
              Description
            </label>
            <textarea
              id="idesc"
              className="input min-h-[90px] resize-none"
              placeholder="Add more detail…"
              value={description}
              maxLength={2000}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Priority</label>
              <select
                className="input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as ItemPriority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Due date</label>
              <input
                type="date"
                className="input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Assignee</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAssignedTo('')}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  !assignedTo ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500'
                }`}
              >
                Unassigned
              </button>
              {members.map((m) => {
                const uid = m.user._id || m.user.id || '';
                const selected = assignedTo === uid;
                return (
                  <button
                    type="button"
                    key={uid}
                    onClick={() => setAssignedTo(uid)}
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      selected ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Avatar user={m.user} size="sm" />
                    {m.user.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {mode === 'edit' ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Delete item
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting || !title.trim()}>
                {submitting ? 'Saving…' : mode === 'create' ? 'Add item' : 'Save changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this item?"
        message="This action can't be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
