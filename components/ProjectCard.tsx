import Link from 'next/link';
import { Project } from '@/types';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project._id}`}
      className="card group flex flex-col p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-semibold text-white"
          style={{ backgroundColor: project.color }}
        >
          {project.name.charAt(0).toUpperCase()}
        </div>
        {project.myRole === 'owner' && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
            Owner
          </span>
        )}
      </div>

      <h3 className="mt-3 truncate text-base font-semibold text-slate-900 group-hover:text-brand-700">
        {project.name}
      </h3>
      <p className="mt-1 line-clamp-2 min-h-[2.5em] text-sm text-slate-500">
        {project.description || 'No description provided.'}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{project.memberCount ?? 1} member{(project.memberCount ?? 1) !== 1 ? 's' : ''}</span>
        <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
