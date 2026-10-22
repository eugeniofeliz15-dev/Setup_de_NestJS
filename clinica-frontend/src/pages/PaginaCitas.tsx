import { useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Cita } from '../types';
import { useCitasStore } from '../stores/citasStore';
import { extraerMensajeError } from '../lib/errorHandler';

export function PaginaCitas() {
  // Conectamos con el store de citas
  const citas = useCitasStore((s) => s.citas);
  const cargando = useCitasStore((s) => s.cargando);
  const cargar = useCitasStore((s) => s.cargar);
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleCambiarEstado = async (citaId: number, nuevoEstado: Cita['status']) => {
    try {
      // El store ya maneja la UI optimista y el rollback si falla
      await actualizarEstado(citaId, nuevoEstado);
      toast.success('Estado de la cita actualizado');
    } catch (err) {
      toast.error(`Error: ${extraerMensajeError(err)}. Cambio revertido.`);
    }
  };

  if (cargando) return <div className="p-8 text-center">Cargando citas...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestión de Citas (UI Optimista con Zustand)</h1>
      
      <div className="space-y-4">
        {citas.map((cita) => (
          <div key={cita.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-semibold text-slate-800">Cita #{cita.id}</p>
              <p className="text-sm text-slate-500">Paciente ID: {cita.pacienteId} | Médico ID: {cita.medicoId}</p>
              <p className="text-xs text-slate-400 mt-1">Estado actual: {cita.status}</p>
            </div>
            
            <div className="flex gap-2">
              {cita.status !== 'COMPLETED' && (
                <button
                  onClick={() => handleCambiarEstado(cita.id, 'COMPLETED')}
                  className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                >
                  Marcar Completada
                </button>
              )}
              {cita.status !== 'CANCELLED' && (
                <button
                  onClick={() => handleCambiarEstado(cita.id, 'CANCELLED')}
                  className="px-3 py-1 text-sm bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}