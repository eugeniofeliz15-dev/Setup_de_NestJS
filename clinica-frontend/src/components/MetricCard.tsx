import type { Metrica, Tendencia } from '../types';

interface MetricCardProps {
  metrica: Metrica;
}

const colorPorTendencia: Record<Tendencia, string> = {
  positiva: 'text-emerald-600',
  negativa: 'text-rose-600',
  neutra: 'text-slate-600',
};

export function MetricCard({ metrica }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{metrica.icono}</span>
        <span className={`text-xs font-semibold uppercase tracking-wide ${colorPorTendencia[metrica.tendencia]}`}>
          {metrica.tendencia}
        </span>
      </div>
      <h3 className="text-sm font-medium text-slate-500 mb-1">{metrica.titulo}</h3>
      <p className="text-3xl font-bold text-slate-800 mb-2">{metrica.valor}</p>
      <p className={`text-sm ${colorPorTendencia[metrica.tendencia]}`}>
        {metrica.descripcion}
      </p>
    </div>
  );
}