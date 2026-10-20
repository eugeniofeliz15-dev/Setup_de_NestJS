import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Cita } from '../types';
import { getAll, updateEstado } from '../services/citas';
import { extraerMensajeError } from '../lib/errorHandler';

export function PaginaCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getAll()
      .then((res) => setCitas(res.data))
      .catch(() => toast.error('Error al cargar citas'))
      .finally(() => setCargando(false));
  }, []);

  // UI OPTIMISTA: Actualizamos la UI antes de que el servidor responda
  const handleCambiarEstado = async (citaId: number, nuevoEstado: Cita['status']) => {
    // 1. Guardamos el estado original por si falla
    const citaOriginal = citas.find((c) => c.id === citaId);
    if (!citaOriginal) return;

    // 2. Actualizamos la UI inmediatamente (Optimista)
    setCitas((prev) =>
      prev.map((c) => (c.id === citaId ? { ...c, status: nuevoEstado } : c))
    );

    try {
      // 3. Llamamos a la API
      await updateEstado(citaId, nuevoEstado);
      toast.success('Estado de la cita actualizado');
    } catch (err) {
      // 4. Si falla, REVERTIMOS al estado original
      setCitas((prev) =>
        prev.map((c) => (c.id === citaId ? citaOriginal : c))
      );
      toast.error(`Error: ${extraerMensajeError(err)}. Cambio revertido.`);
    }
  };

  if (cargando) return <div className="p-8 text-center">Cargando citas...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestión de Citas (UI Optimista)</h1>
      
      <div className="space-y-4">
        {citas.map((cita) => (
          <div key={cita.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-semibold text-slate-800">Cita #{cita.id}</p>
              <p className="text-sm text-slate-500">Paciente ID: {cita.pacienteId} | Médico ID: {cita.medicoId}</p>
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