import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Paciente } from '../types';
import { BadgeEstado } from '../components/BadgeEstado';
import { api } from '../lib/axios';
import { AlertaBanner, Spinner } from '../shared/components/ui';
import { extraerMensajeError } from '../lib/errorHandler';

export function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    setCargando(true);
    setError(null);
    api.get<Paciente>(`/pacientes/${id}`)
      .then((res) => setPaciente(res.data))
      .catch((err: unknown) => setError(extraerMensajeError(err)))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <Spinner fullscreen label="Cargando paciente" />
    );
  }

  if (error || !paciente) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <AlertaBanner
          tipo={error ? 'error' : 'advertencia'}
          mensaje={error ? `No se pudo cargar el paciente: ${error}` : 'Paciente no encontrado o no disponible.'}
          className="mb-4"
        />
        <Link to="/pacientes" className="text-indigo-600 hover:underline">
          ← Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-slate-600 hover:text-slate-900 flex items-center gap-2"
      >
        ← Volver
      </button>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {paciente.firstName} {paciente.lastName}
            </h1>
            <p className="text-slate-500">ID: {paciente.id}</p>
          </div>
          <BadgeEstado estado={paciente.estado || 'activo'} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Email</h3>
            <p className="text-slate-800">{paciente.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Teléfono</h3>
            <p className="text-slate-800">{paciente.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Fecha de nacimiento</h3>
            <p className="text-slate-800">
              {new Date(paciente.birthDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Registrado el</h3>
            <p className="text-slate-800">
              {paciente.createdAt ? new Date(paciente.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}