import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Paciente, EstadoPaciente } from '../types';
import { PacienteCard } from '../components/PacienteCard';
import { ModalConfirmacion } from '../components/ModalConfirmacion';
import { getAll, remove, update } from '../services/pacientes';
import { extraerMensajeError } from '../lib/errorHandler';

export function PaginaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  
  // Estados para búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoPaciente | 'todos'>('todos');
  
  // Estado para el Modal de eliminación
  const [pacienteAEliminar, setPacienteAEliminar] = useState<Paciente | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarPacientes = async () => {
    setCargando(true);
    setError(false);
    try {
      const res = await getAll();
      const pacientesConEstado = res.data.map((p) => ({
        ...p,
        estado: p.estado || 'activo',
      }));
      setPacientes(pacientesConEstado);
    } catch (err) {
      setError(true);
      toast.error(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  // ✅ 2. Función para cambiar estado con persistencia en BD
  const handleCambiarEstado = async (id: number, estado: EstadoPaciente) => {
    const pacienteOriginal = pacientes.find((p) => p.id === id);
    if (!pacienteOriginal) return;

    // 1. Actualizar la UI inmediatamente (optimista)
    setPacientes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado } : p))
    );

    try {
      // 2. Llamar al backend para persistir el cambio
      await update(id, { estado });
      toast.success('Estado actualizado correctamente');
    } catch (err) {
      // 3. Si falla, revertir al estado original
      setPacientes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: pacienteOriginal.estado } : p))
      );
      toast.error(`Error: ${extraerMensajeError(err)}`);
    }
  };

  // ✅ 3. Función para abrir el modal (la que faltaba)
  const handleSolicitarEliminacion = (paciente: Paciente) => {
    setPacienteAEliminar(paciente);
  };

  const handleConfirmarEliminacion = async () => {
    if (!pacienteAEliminar) return;
    
    setEliminando(true);
    try {
      await remove(pacienteAEliminar.id);
      setPacientes((prev) => prev.filter((p) => p.id !== pacienteAEliminar.id));
      toast.success('Paciente eliminado correctamente');
      setPacienteAEliminar(null);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setEliminando(false);
    }
  };

  // Filtrado local (rápido y eficiente)
  const pacientesFiltrados = pacientes.filter((p) => {
    const coincideNombre = `${p.firstName} ${p.lastName}`.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
    return coincideNombre && coincideEstado;
  });

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-rose-200">
          <p className="text-rose-600 text-lg mb-4">Error al cargar los pacientes</p>
          <button onClick={cargarPacientes} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
        <Link to="/pacientes/nuevo" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          + Nuevo Paciente
        </Link>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as EstadoPaciente | 'todos')}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="en_espera">En espera</option>
        </select>
      </div>

      {pacientesFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-lg">
            {pacientes.length === 0 ? 'No hay pacientes registrados' : 'No se encontraron resultados para tu búsqueda'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pacientesFiltrados.map((paciente) => (
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onCambiarEstado={handleCambiarEstado}
              onEliminar={() => handleSolicitarEliminacion(paciente)}
            />
          ))}
        </div>
      )}

      {/* Modal de Confirmación */}
      <ModalConfirmacion
        isOpen={!!pacienteAEliminar}
        onClose={() => setPacienteAEliminar(null)}
        onConfirm={handleConfirmarEliminacion}
        title="Eliminar Paciente"
        message={`¿Estás seguro de eliminar a ${pacienteAEliminar?.firstName} ${pacienteAEliminar?.lastName}? Esta acción no se puede deshacer.`}
        isLoading={eliminando}
      />
    </div>
  );
}