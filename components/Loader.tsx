export default function Loader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-500" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
