import { useState } from 'react';
import type { Metrica } from '../types';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';

export function PaginaDashboard() {
  const [pacientes, setPacientes] = useState(128);
  const [mantenimiento, setMantenimiento] = useState(false);

  const metricas: Metrica[] = [
    {
      id: 'pacientes',
      titulo: 'Pacientes',
      valor: pacientes,
      descripcion: '+12% respecto al mes anterior',
      tendencia: 'positiva',
      icono: '👥',
    },
    {
      id: 'citas',
      titulo: 'Citas Hoy',
      valor: 42,
      descripcion: '8 reprogramadas',
      tendencia: 'neutra',
      icono: '📅',
    },
    {
      id: 'consultas',
      titulo: 'Consultas Pendientes',
      valor: 17,
      descripcion: '-3 desde ayer',
      tendencia: 'positiva',
      icono: '📋',
    },
    {
      id: 'disponibilidad',
      titulo: 'Disponibilidad',
      valor: '87%',
      descripcion: 'Capacidad de atención',
      tendencia: 'neutra',
      icono: '⏱️',
    },
  ];

  const incrementarPacientes = () => setPacientes((prev) => prev + 1);
  const decrementarPacientes = () => setPacientes((prev) => Math.max(0, prev - 1));

  return (
    <div className="min-h-screen bg-slate-50">
      {mantenimiento && (
        <div className="bg-rose-600 text-white text-center py-2 font-medium">
          ⚠️ El sistema se encuentra en modo mantenimiento
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clínica Salud Integral</h1>
          <p className="text-sm text-slate-500">Panel de control</p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge activo={!mantenimiento} />
          <button
            onClick={() => setMantenimiento((prev) => !prev)}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            {mantenimiento ? 'Desactivar' : 'Activar'} Mantenimiento
          </button>
        </div>
      </header>

      <main className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Métricas generales</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Pacientes:</span>
            <button
              onClick={decrementarPacientes}
              className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 transition-colors"
            >
              −
            </button>
            <button
              onClick={incrementarPacientes}
              className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold hover:bg-emerald-200 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricas.map((metrica) => (
            <MetricCard key={metrica.id} metrica={metrica} />
          ))}
        </div>
      </main>
    </div>
  );
}