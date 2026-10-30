export function SkeletonPacienteRow() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full animate-pulse flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="h-6 w-40 rounded bg-slate-200" />
        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </div>
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-4/5 rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
      </div>
      <div className="mt-auto flex gap-2 border-t border-slate-100 pt-4">
        <div className="h-9 flex-1 rounded-lg bg-slate-200" />
        <div className="h-9 w-24 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}
