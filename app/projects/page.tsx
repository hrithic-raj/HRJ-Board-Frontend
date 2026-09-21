'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api, { getErrorMessage } from '@/lib/api';
import { Project } from '@/types';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';
import Loader from '@/components/Loader';

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data.projects);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Your projects</h1>
            <p className="mt-1 text-sm text-slate-500">
              {projects.length} project{projects.length !== 1 ? 's' : ''} · Welcome back, {user.name.split(' ')[0]}
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <span className="text-base leading-none">+</span> New project
          </button>
        </div>

        {projects.length > 0 && (
          <input
            className="input mt-5 max-w-xs"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader label="Loading projects…" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="card flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl">
                📋
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
              </h3>
              <p className="max-w-sm text-sm text-slate-500">
                {projects.length === 0
                  ? 'Create your first project to get a kanban board you and your team can collaborate on in real time.'
                  : 'Try a different search term.'}
              </p>
              {projects.length === 0 && (
                <button className="btn-primary mt-2" onClick={() => setShowCreate(true)}>
                  Create a project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </div>
      </main>

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={(project) => {
            setShowCreate(false);
            router.push(`/projects/${project._id}`);
          }}
        />
      )}
    </div>
  );
}
