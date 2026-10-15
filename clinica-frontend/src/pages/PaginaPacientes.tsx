import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Paciente, EstadoPaciente } from '../types/paciente';
import { PacienteCard } from '../components/PacienteCard';

const PACIENTES_INICIALES: Paciente[] = [
  { id: '1', nombre: 'Ana', apellido: 'García', email: 'ana.garcia@email.com', telefono: '+52 55 1234 5678', especialidadAsignada: 'Cardiología', ultimaCita: '2023-10-10', estado: 'activo' },
  { id: '2', nombre: 'Carlos', apellido: 'López', email: 'carlos.lopez@email.com', telefono: '+52 55 8765 4321', especialidadAsignada: 'Dermatología', ultimaCita: '2023-09-15', estado: 'en_espera' },
  { id: '3', nombre: 'María', apellido: 'Rodríguez', email: 'maria.rod@email.com', telefono: '+52 55 1122 3344', especialidadAsignada: 'Pediatría', ultimaCita: '2023-10-01', estado: 'activo' },
  { id: '4', nombre: 'Jorge', apellido: 'Martínez', email: 'jorge.mtz@email.com', telefono: '+52 55 9988 7766', especialidadAsignada: 'Neurología', ultimaCita: '2023-08-20', estado: 'inactivo' },
];

type FiltroEstado = 'Todos' | EstadoPaciente;

export function PaginaPacientes() {
  // 1. Estado de la lista (Inmutable)
  const [pacientes, setPacientes] = useState<Paciente[]>(PACIENTES_INICIALES);

  // 2. Estado de los filtros
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>('Todos');

  // 3. Estado del formulario (Controlled Inputs)
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoApellido, setNuevoApellido] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPaciente>('activo');
  const [errorForm, setErrorForm] = useState('');

  // Cálculo derivado: Filtros combinados (NO se guarda en useState)
  const pacientesFiltrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (estadoFiltro === 'Todos' || p.estado === estadoFiltro)
  );

  // Handlers de Filtros
  const handleBusquedaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const handleEstadoFiltroChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEstadoFiltro(e.target.value as FiltroEstado);
  };

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setEstadoFiltro('Todos');
  };

  // Handler: Agregar Paciente (Inmutable)
  const handleAgregarPaciente = (e: FormEvent) => {
    e.preventDefault();
    
    // Validación mínima
    if (!nuevoNombre.trim() || !nuevoEmail.trim()) {
      setErrorForm('Nombre y email son obligatorios');
      return;
    }

    const nuevoPaciente: Paciente = {
      id: Date.now().toString(), // ID único simple
      nombre: nuevoNombre.trim(),
      apellido: nuevoApellido.trim(),
      email: nuevoEmail.trim(),
      telefono: 'Pendiente',
      especialidadAsignada: 'General',
      ultimaCita: 'N/A',
      estado: nuevoEstado,
    };

    // Actualización inmutable
    setPacientes(prev => [...prev, nuevoPaciente]);

    // Limpiar formulario
    setNuevoNombre('');
    setNuevoApellido('');
    setNuevoEmail('');
    setNuevoEstado('activo');
    setErrorForm('');
  };

  // Handler: Cambiar Estado (Inmutable con .map)
  const handleCambiarEstado = (id: string, nuevoEstado: EstadoPaciente) => {
    setPacientes(prev => 
      prev.map(p => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
  };

  // Handler: Eliminar (Inmutable con .filter)
  const handleEliminar = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a este paciente?')) {
      setPacientes(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Directorio de Pacientes</h1>
        <p className="text-slate-500 mt-1">Gestiona y visualiza la información de los pacientes.</p>
      </header>

      {/* Sección de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Buscar por nombre</label>
            <input
              type="text"
              value={busqueda}
              onChange={handleBusquedaChange}
              placeholder="Ej: Ana, García..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select
              value={estadoFiltro}
              onChange={handleEstadoFiltroChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="en_espera">En espera</option>
            </select>
          </div>
          <button
            onClick={handleLimpiarFiltros}
            className="w-full md:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          {pacientesFiltrados.length} paciente(s) encontrado(s)
        </p>
      </div>

      {/* Sección de Agregar Paciente */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Agregar Nuevo Paciente</h2>
        <form onSubmit={handleAgregarPaciente} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
            <input
              type="text"
              value={nuevoApellido}
              onChange={(e) => setNuevoApellido(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estado inicial</label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value as EstadoPaciente)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="en_espera">En espera</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Agregar
            </button>
          </div>
        </form>
        {errorForm && <p className="text-rose-600 text-sm mt-2 font-medium">⚠️ {errorForm}</p>}
      </div>

      {/* Lista de Pacientes */}
      {pacientesFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacientesFiltrados.map((paciente) => (
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onCambiarEstado={handleCambiarEstado}
              onEliminar={handleEliminar}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-lg">No se encontraron pacientes con esos criterios.</p>
        </div>
      )}
    </div>
  );
}