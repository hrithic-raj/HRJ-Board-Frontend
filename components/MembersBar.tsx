'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '@/lib/api';
import { Project, ProjectMember } from '@/types';
import Avatar from './Avatar';

export default function MembersBar({
  project,
  members,
  isOwner,
  onlineUserIds = [],
  onInviteTokenChanged,
}: {
  project: Project;
  members: ProjectMember[];
  isOwner: boolean;
  onlineUserIds?: string[];
  onInviteTokenChanged: (token: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const inviteLink =
    typeof window !== 'undefined' ? `${window.location.origin}/invite/${project.inviteToken}` : '';

  const isOnline = (m: ProjectMember) => onlineUserIds.includes(m.user._id || m.user.id || '');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Invite link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  const regenerate = async () => {
    setRegenerating(true);
    try {
      const { data } = await api.post(`/projects/${project._id}/regenerate-invite`);
      onInviteTokenChanged(data.inviteToken);
      toast.success('New invite link generated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRegenerating(false);
    }
  };

  const visible = members.slice(0, 4);
  const extra = members.length - visible.length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center -space-x-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {visible.map((m) => (
          <Avatar key={m._id} user={m.user} size="sm" online={isOnline(m)} />
        ))}
        {extra > 0 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600 ring-2 ring-white dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-900">
            +{extra}
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-80 max-w-[90vw] animate-slide-up rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Members ({members.length})
            </h4>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
              {members.map((m) => (
                <div key={m._id} className="flex items-center gap-2">
                  <Avatar user={m.user} size="sm" online={isOnline(m)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-800 dark:text-slate-200">{m.user.name}</p>
                    <p className="truncate text-xs text-slate-400 dark:text-slate-500">{m.user.email}</p>
                  </div>
                  {m.role === 'owner' && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                      Owner
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Invite link</p>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  readOnly
                  className="input flex-1 truncate text-xs"
                  value={inviteLink}
                  onFocus={(e) => e.target.select()}
                />
                <button className="btn-secondary shrink-0 !px-3 !py-2" onClick={copyLink}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                Anyone with this link can join the project after signing up or logging in.
              </p>
              {isOwner && (
                <button
                  onClick={regenerate}
                  disabled={regenerating}
                  className="mt-2 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  {regenerating ? 'Generating…' : 'Generate new link'}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
