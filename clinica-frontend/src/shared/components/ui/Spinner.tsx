interface SpinnerProps {
  fullscreen?: boolean;
  label?: string;
}

export function Spinner({ fullscreen = false, label = 'Cargando' }: SpinnerProps) {
  const spinner = (
    <span
      aria-hidden="true"
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );

  if (fullscreen) {
    return (
      <div
        role="status"
        aria-label={label}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/70"
      >
        {spinner}
      </div>
    );
  }

  return (
    <span role="status" aria-label={label} className="inline-flex items-center">
      {spinner}
    </span>
  );
}
