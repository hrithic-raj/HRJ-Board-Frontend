'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Renders nothing. If the visitor already has a valid session, it sends
 * them straight to their projects instead of the marketing page.
 *
 * Search engine crawlers never carry an auth token, so they always see the
 * full landing page content below - this only affects real, logged-in users.
 */
export default function AuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/projects');
  }, [user, loading, router]);

  return null;
}
