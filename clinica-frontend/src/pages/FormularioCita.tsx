import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { citaSchema, type CitaFormData } from '../schemas/citaSchema';
import { useMedicos } from '../hooks/useMedicos';

export function FormularioCita() {
  const { medicos, cargando } = useMedicos();
  const [enviando, setEnviando] = useState(false);
  const [citaExitosa, setCitaExitosa] = useState<CitaFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
  });

  const onSubmit = async (data: CitaFormData) => {
    setEnviando(true);
    // Simulamos petición al backend (1.5s)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setEnviando(false);
    setCitaExitosa(data);
  };

  const handleNuevaCita = () => {
    setCitaExitosa(null);
    reset(); // Limpia el formulario
  };

  // Si ya se agendó con éxito, mostramos la tarjeta de confirmación
  if (citaExitosa) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Cita Agendada!</h2>
          <p className="text-slate-600 mb-6">
            La cita para <strong>{citaExitosa.pacienteNombre}</strong> con el médico seleccionado ha sido registrada exitosamente.
          </p>
          <button
            onClick={handleNuevaCita}
            className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Agendar otra cita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Agendar Nueva Cita</h1>
          <p className="text-slate-500 mt-1">Completa los datos para reservar un turno médico.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nombre del Paciente */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Paciente *</label>
            <input
              {...register('pacienteNombre')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.pacienteNombre ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300'
              }`}
              placeholder="Ej: Ana García"
            />
            {errors.pacienteNombre && (
              <p className="text-rose-600 text-sm mt-1">{errors.pacienteNombre.message}</p>
            )}
          </div>

          {/* Médico */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Médico *</label>
            <select
              {...register('medicoId')}
              disabled={cargando}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                errors.medicoId ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300'
              }`}
            >
              {cargando ? (
                <option>Cargando médicos...</option>
              ) : (
                <>
                  <option value="">Selecciona un médico</option>
                  {medicos.map((medico) => (
                    <option key={medico.id} value={medico.id}>
                      {medico.nombre} - {medico.especialidad}
                    </option>
                  ))}
                </>
              )}
            </select>
            {errors.medicoId && (
              <p className="text-rose-600 text-sm mt-1">{errors.medicoId.message}</p>
            )}
          </div>

          {/* Fecha y Hora (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha *</label>
              <input
                type="date"
                {...register('fecha')}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.fecha ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                }`}
              />
              {errors.fecha && (
                <p className="text-rose-600 text-sm mt-1">{errors.fecha.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hora *</label>
              <input
                type="time"
                {...register('hora')}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.hora ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300'
                }`}
              />
              {errors.hora && (
                <p className="text-rose-600 text-sm mt-1">{errors.hora.message}</p>
              )}
            </div>
          </div>

          {/* Urgencia */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nivel de Urgencia *</label>
            <select
              {...register('urgencia')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                errors.urgencia ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300'
              }`}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
            {errors.urgencia && (
              <p className="text-rose-600 text-sm mt-1">{errors.urgencia.message}</p>
            )}
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Motivo de la consulta *</label>
            <textarea
              {...register('motivo')}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                errors.motivo ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300'
              }`}
              placeholder="Describe brevemente los síntomas o el motivo..."
            />
            {errors.motivo && (
              <p className="text-rose-600 text-sm mt-1">{errors.motivo.message}</p>
            )}
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={isSubmitting || enviando}
            className="w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting || enviando ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Agendando...
              </>
            ) : (
              'Confirmar y Agendar Cita'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}