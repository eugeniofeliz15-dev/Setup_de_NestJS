import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Cita } from '../types';
import { useCitasStore } from '../stores/citasStore';
import { extraerMensajeError } from '../lib/errorHandler';
import {
  AlertaBanner,
  EstadoVacio,
  ModalConfirmacion,
  SkeletonCitaRow,
} from '../shared/components/ui';

export function PaginaCitas() {
  const navigate = useNavigate();
  // Conectamos con el store de citas
  const citas = useCitasStore((s) => s.citas);
  const cargando = useCitasStore((s) => s.cargando);
  const error = useCitasStore((s) => s.error);
  const cargar = useCitasStore((s) => s.cargar);
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado);
  const [citaACancelar, setCitaACancelar] = useState<Cita | null>(null);
  const [actualizandoEstado, setActualizandoEstado] = useState(false);

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

  const handleConfirmarCancelacion = async () => {
    if (!citaACancelar) return;

    setActualizandoEstado(true);
    try {
      await actualizarEstado(citaACancelar.id, 'CANCELLED');
      toast.success('Cita cancelada');
      setCitaACancelar(null);
    } catch (err) {
      toast.error(`Error: ${extraerMensajeError(err)}. Cambio revertido.`);
    } finally {
      setActualizandoEstado(false);
    }
  };

  if (cargando) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-8" aria-label="Cargando citas">
        {Array.from({ length: 5 }, (_, index) => <SkeletonCitaRow key={index} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        <AlertaBanner tipo="error" mensaje={`No se pudieron cargar las citas: ${error}`} />
        <button
          type="button"
          onClick={() => cargar()}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        Gestión de Citas (UI Optimista con Zustand)
      </h1>

      {citas.length === 0 ? (
        <EstadoVacio
          titulo="No hay citas registradas"
          descripcion="Agenda una cita para que aparezca en esta lista."
          accion={{ label: 'Agendar cita', onClick: () => navigate('/citas/nueva') }}
        />
      ) : (
        <div className="space-y-4">
          {citas.map((cita) => (
            <div
              key={cita.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-800">Cita #{cita.id}</p>
                <p className="text-sm text-slate-500">
                  Paciente ID: {cita.pacienteId} | Médico ID: {cita.medicoId}
                </p>
                <p className="mt-1 text-xs text-slate-400">Estado actual: {cita.status}</p>
              </div>

              <div className="flex gap-2">
                {cita.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleCambiarEstado(cita.id, 'COMPLETED')}
                    className="rounded bg-emerald-100 px-3 py-1 text-sm text-emerald-700 transition-colors hover:bg-emerald-200"
                  >
                    Marcar Completada
                  </button>
                )}
                {cita.status !== 'CANCELLED' && (
                  <button
                    onClick={() => setCitaACancelar(cita)}
                    className="rounded bg-rose-100 px-3 py-1 text-sm text-rose-700 transition-colors hover:bg-rose-200"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalConfirmacion
        isOpen={!!citaACancelar}
        onClose={() => setCitaACancelar(null)}
        onConfirm={handleConfirmarCancelacion}
        title="Cancelar cita"
        message={`¿Confirmas la cancelación de la cita #${citaACancelar?.id}?`}
        isLoading={actualizandoEstado}
        confirmLabel="Cancelar cita"
        loadingLabel="Actualizando..."
      />
    </div>
  );
}