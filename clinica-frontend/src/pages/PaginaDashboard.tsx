import { useState, useEffect } from 'react';
import type { Metrica, Paciente, Medico, Cita } from '../types';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/axios';
import { AlertaBanner, SkeletonMetricCard } from '../shared/components/ui';
import { extraerMensajeError } from '../lib/errorHandler';

export function PaginaDashboard() {
  const [mantenimiento, setMantenimiento] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metricas, setMetricas] = useState<Metrica[]>([]);

  useEffect(() => {
    const cargarMetricas = async () => {
      setCargando(true);
      setError(null);
      try {
        const [pacientesRes, medicosRes, citasRes] = await Promise.all([
          api.get<Paciente[]>('/pacientes'),
          api.get<Medico[]>('/medicos'),
          api.get<Cita[]>('/citas'),
        ]);

        const pacientes = pacientesRes.data;
        const medicos = medicosRes.data;
        const citas = citasRes.data;

        const citasProgramadas = citas.filter((c: Cita) => c.status === 'SCHEDULED');
        const citasCompletadas = citas.filter((c: Cita) => c.status === 'COMPLETED');

        setMetricas([
          {
            id: 'pacientes',
            titulo: 'Pacientes',
            valor: pacientes.length,
            descripcion: 'Total registrados',
            tendencia: 'positiva',
            icono: '👥',
          },
          {
            id: 'medicos',
            titulo: 'Médicos',
            valor: medicos.length,
            descripcion: 'Equipo médico',
            tendencia: 'neutra',
            icono: '‍⚕️',
          },
          {
            id: 'citas-programadas',
            titulo: 'Citas Programadas',
            valor: citasProgramadas.length,
            descripcion: 'Pendientes de atención',
            tendencia: 'neutra',
            icono: '📅',
          },
          {
            id: 'citas-completadas',
            titulo: 'Completadas Hoy',
            valor: citasCompletadas.length,
            descripcion: 'Atendidas',
            tendencia: 'positiva',
            icono: '✅',
          },
        ]);
      } catch (err) {
        setError(extraerMensajeError(err));
      } finally {
        setCargando(false);
      }
    };

    cargarMetricas();
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="px-8 py-8">
          <h1 className="mb-6 text-xl font-semibold text-slate-800">Métricas generales</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <SkeletonMetricCard key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
          <AlertaBanner tipo="error" mensaje={`Error al cargar los datos del dashboard: ${error}`} />
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Métricas generales</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricas.map((metrica) => (
            <MetricCard key={metrica.id} metrica={metrica} />
          ))}
        </div>
      </main>
    </div>
  );
}