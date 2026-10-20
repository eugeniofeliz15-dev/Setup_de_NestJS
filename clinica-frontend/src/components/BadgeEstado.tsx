import type { EstadoPaciente } from '../types';

interface BadgeEstadoProps {
  estado: EstadoPaciente;
}

const colorPorEstado: Record<EstadoPaciente, string> = {
  activo: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactivo: 'bg-slate-100 text-slate-700 border-slate-200',
  en_espera: 'bg-amber-100 text-amber-700 border-amber-200',
};

const etiquetaPorEstado: Record<EstadoPaciente, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  en_espera: 'En espera',
};

export function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorPorEstado[estado]}`}>
      {etiquetaPorEstado[estado]}
    </span>
  );
}