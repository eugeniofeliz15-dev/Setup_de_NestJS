import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Paciente, EstadoPaciente } from '../types';
import { PacienteCard } from '../components/PacienteCard';
import { api } from '../lib/axios';

export function PaginaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cargarPacientes = async () => {
      setCargando(true);
      setError(false);
      try {
        const res = await api.get<Paciente[]>('/pacientes');
        // Agregar estado "activo" por defecto si no viene de la BD
        const pacientesConEstado = res.data.map((p) => ({
          ...p,
          estado: p.estado || 'activo',
        }));
        setPacientes(pacientesConEstado);
      } catch (err) {
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    cargarPacientes();
  }, []);

  const handleCambiarEstado = (id: number, estado: EstadoPaciente) => {
    setPacientes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado } : p))
    );
  };

  const handleEliminar = (id: number) => {
    setPacientes((prev) => prev.filter((p) => p.id !== id));
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Cargando pacientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-rose-200">
          <p className="text-rose-600 text-lg mb-4">Error al cargar los pacientes</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
        <Link
          to="/citas/nueva"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Nueva Cita
        </Link>
      </div>

      {pacientes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-lg">No hay pacientes registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pacientes.map((paciente) => (
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onCambiarEstado={handleCambiarEstado}
              onEliminar={handleEliminar}
            />
          ))}
        </div>
      )}
    </div>
  );
}