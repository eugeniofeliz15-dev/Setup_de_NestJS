import type { ReactNode } from 'react';

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EstadoVacio({ titulo, descripcion, accion, children }: EstadoVacioProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-slate-800">{titulo}</h2>
      {descripcion && <p className="mt-2 text-slate-500">{descripcion}</p>}
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-white transition-colors hover:bg-indigo-700"
        >
          {accion.label}
        </button>
      )}
      {children}
    </div>
  );
}
