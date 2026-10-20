import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Paciente } from '../types';
import { BadgeEstado } from '../components/BadgeEstado';
import { api } from '../lib/axios';

export function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setCargando(true);
    setError(false);
    api.get<Paciente>(`/pacientes/${id}`)
      .then((res) => setPaciente(res.data))
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Cargando paciente...</p>
        </div>
      </div>
    );
  }

  if (error || !paciente) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Paciente no encontrado</h2>
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