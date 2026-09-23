import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to HRJ Board to access your projects and real-time kanban boards.',
  alternates: { canonical: '/login' },
};

export default function LoginPage() {
  return <LoginForm />;
}
