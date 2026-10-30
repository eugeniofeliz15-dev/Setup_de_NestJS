export function SkeletonMetricCard() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="h-9 w-9 rounded bg-slate-200" />
        <div className="h-3 w-16 rounded bg-slate-200" />
      </div>
      <div className="mb-2 h-4 w-24 rounded bg-slate-200" />
      <div className="mb-3 h-9 w-20 rounded bg-slate-200" />
      <div className="h-4 w-32 rounded bg-slate-200" />
    </div>
  );
}
