export function SkeletonCitaRow() {
  return (
    <div
      aria-hidden="true"
      className="flex h-16 animate-pulse items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="space-y-2">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="h-3 w-40 rounded bg-slate-200" />
      </div>
      <div className="h-6 w-24 rounded-full bg-slate-200" />
    </div>
  );
}
