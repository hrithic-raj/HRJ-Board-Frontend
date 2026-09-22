'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import ThemeToggle from '@/components/ThemeToggle';

interface InvitePreview {
  id: string;
  name: string;
  description: string;
  ownerName: string;
}

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  // 1. Always fetch a public preview of the invite so we can show project info
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/projects/invite/${token}`);
        setPreview(data.project);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    })();
  }, [token]);

  // 2. If the user is already authenticated, join the project immediately
  //    and take them straight to the board.
  useEffect(() => {
    if (authLoading || !user || !preview) return;

    const join = async () => {
      setJoining(true);
      try {
        const { data } = await api.post(`/projects/join/${token}`);
        if (!data.alreadyMember) toast.success(`You joined "${preview.name}"`);
        router.replace(`/projects/${data.project._id || data.project.id}`);
      } catch (err) {
        setError(getErrorMessage(err));
        setJoining(false);
      }
    };

    join();
  }, [authLoading, user, preview, token, router]);

  const redirectTarget = `/invite/${token}`;

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="card max-w-sm p-6 text-center">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Invite link problem</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{error}</p>
          <Link href="/projects" className="btn-primary mt-4 inline-flex">
            Go to your projects
          </Link>
        </div>
      </div>
    );
  }

  if (!preview || authLoading || joining) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <Loader label={joining ? 'Joining project…' : 'Loading invite…'} />
      </div>
    );
  }

  // Not logged in -> show a landing card prompting login/signup
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="card w-full max-w-sm animate-slide-up p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-xl font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
          {preview.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">You've been invited</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">{preview.ownerName}</span> invited you to collaborate on
        </p>
        <p className="mt-1 text-base font-semibold text-brand-700 dark:text-brand-400">{preview.name}</p>
        {preview.description && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{preview.description}</p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Link href={`/register?redirect=${encodeURIComponent(redirectTarget)}`} className="btn-primary w-full">
            Create an account
          </Link>
          <Link href={`/login?redirect=${encodeURIComponent(redirectTarget)}`} className="btn-secondary w-full">
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}
