'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

function RegisterForm() {
  const { register, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace(redirect || '/projects');
  }, [user, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      router.replace(redirect || '/projects');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white dark:bg-brand-500">
            H
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {redirect?.startsWith('/invite')
              ? 'Sign up to accept your invitation'
              : "Join HRJ Board and organize your team's work"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              maxLength={60}
              className="input"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
            className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
