interface StatusBadgeProps {
  activo: boolean;
}

export function StatusBadge({ activo }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        activo
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-rose-100 text-rose-700'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          activo ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />
      {activo ? 'Sistema Operativo' : 'Modo Mantenimiento'}
    </span>
  );
}