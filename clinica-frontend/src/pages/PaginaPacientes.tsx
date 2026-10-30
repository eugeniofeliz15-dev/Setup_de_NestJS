import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Paciente, EstadoPaciente } from '../types';
import { PacienteCard } from '../components/PacienteCard';
import { usePacientesStore } from '../stores/pacientesStore';
import { useFiltrosStore } from '../stores/filtrosStore';
import { useDebounce } from '../hooks/useDebounce';
import { extraerMensajeError } from '../lib/errorHandler';
import {
  AlertaBanner,
  EstadoVacio,
  ModalConfirmacion,
  SkeletonPacienteRow,
  Spinner,
} from '../shared/components/ui';

export function PaginaPacientes() {
  const navigate = useNavigate();
  const pacientes = usePacientesStore((s) => s.pacientes);
  const cargando = usePacientesStore((s) => s.cargando);
  const error = usePacientesStore((s) => s.error);
  const cargar = usePacientesStore((s) => s.cargar);
  const eliminar = usePacientesStore((s) => s.eliminar);
  const actualizar = usePacientesStore((s) => s.actualizar);

  const queryPacientes = useFiltrosStore((s) => s.queryPacientes);
  const estadoFiltro = useFiltrosStore((s) => s.estadoFiltro);
  const setQueryPacientes = useFiltrosStore((s) => s.setQueryPacientes);
  const setEstadoFiltro = useFiltrosStore((s) => s.setEstadoFiltro);

  const [pacienteAEliminar, setPacienteAEliminar] = useState<Paciente | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // ✅ Aplicar debounce a la búsqueda
  const queryDebounceada = useDebounce(queryPacientes, 350);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleCambiarEstado = async (id: number, estado: EstadoPaciente) => {
    try {
      await actualizar(id, { estado });
      toast.success('Estado actualizado correctamente');
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  };

  const handleSolicitarEliminacion = (paciente: Paciente) => {
    setPacienteAEliminar(paciente);
  };

  const handleConfirmarEliminacion = async () => {
    if (!pacienteAEliminar) return;
    
    setEliminando(true);
    try {
      await eliminar(pacienteAEliminar.id);
      toast.success('Paciente eliminado correctamente');
      setPacienteAEliminar(null);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setEliminando(false);
    }
  };

  // Filtrado usando la query debounceada
  const pacientesFiltrados = pacientes.filter((p) => {
    const coincideNombre = `${p.firstName} ${p.lastName}`
      .toLowerCase()
      .includes(queryDebounceada.toLowerCase());
    const coincideEstado = estadoFiltro === 'todos' || p.estado === estadoFiltro;
    return coincideNombre && coincideEstado;
  });

  if (cargando) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Pacientes</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonPacienteRow key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <AlertaBanner tipo="error" mensaje={error} />
        <button onClick={() => cargar()} className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700">
            Reintentar
        </button>
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

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={queryPacientes}
            onChange={(e) => setQueryPacientes(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {/* Spinner mientras busca */}
          {queryPacientes && queryPacientes !== queryDebounceada && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner label="Buscando pacientes" />
            </div>
          )}
        </div>
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value as EstadoPaciente | 'todos')}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="en_espera">En espera</option>
        </select>
      </div>

      {pacientesFiltrados.length === 0 ? (
        <EstadoVacio
          titulo={pacientes.length === 0 ? 'No hay pacientes registrados' : 'No se encontraron resultados'}
          descripcion={pacientes.length === 0 ? 'Agrega el primer paciente para comenzar.' : 'Prueba con otros filtros de búsqueda.'}
          accion={pacientes.length === 0
            ? { label: 'Agregar paciente', onClick: () => navigate('/pacientes/nuevo') }
            : undefined}
        />
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