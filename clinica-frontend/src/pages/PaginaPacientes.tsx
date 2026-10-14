import { useState, useMemo } from 'react';
import type { Paciente } from '../types/paciente';
import { BuscadorPacientes } from '../components/BuscadorPacientes';
import { PacienteCard } from '../components/PacienteCard';

// ============================================================================
// ANÁLISIS DEL CÓDIGO GENERADO POR IA (Antes del Refactor):
// 1. Responsabilidades mezcladas: La IA puso el estado del buscador, el mapeo 
//    de datos y la lógica de colores de las etiquetas en un solo componente gigante.
// 2. Datos hardcodeados en el JSX: Los pacientes de ejemplo estaban escritos 
//    directamente dentro del return, violando el principio de separación de datos y vista.
// 3. Falta de tipado estricto: La IA usaba `any` para el evento del input y 
//    no reutilizaba el tipo `EstadoPaciente`, usando strings sueltos ('activo', etc).
// ============================================================================

const PACIENTES_MOCK: Paciente[] = [
  {
    id: '1',
    nombre: 'Ana',
    apellido: 'García',
    email: 'ana.garcia@email.com',
    telefono: '+52 55 1234 5678',
    especialidadAsignada: 'Cardiología',
    ultimaCita: '2023-10-10',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@email.com',
    telefono: '+52 55 8765 4321',
    especialidadAsignada: 'Dermatología',
    ultimaCita: '2023-09-15',
    estado: 'en_espera',
  },
  {
    id: '3',
    nombre: 'María',
    apellido: 'Rodríguez',
    email: 'maria.rod@email.com',
    telefono: '+52 55 1122 3344',
    especialidadAsignada: 'Pediatría',
    ultimaCita: '2023-10-01',
    estado: 'activo',
  },
  {
    id: '4',
    nombre: 'Jorge',
    apellido: 'Martínez',
    email: 'jorge.mtz@email.com',
    telefono: '+52 55 9988 7766',
    especialidadAsignada: 'Neurología',
    ultimaCita: '2023-08-20',
    estado: 'inactivo',
  },
  {
    id: '5',
    nombre: 'Laura',
    apellido: 'Sánchez',
    email: 'laura.sanchez@email.com',
    telefono: '+52 55 5544 3322',
    especialidadAsignada: 'Traumatología',
    ultimaCita: '2023-10-12',
    estado: 'activo',
  },
];

export function PaginaPacientes() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Filtramos los pacientes de forma derivada (no guardamos el filtro en otro estado)
  const pacientesFiltrados = useMemo(() => {
    const busqueda = terminoBusqueda.toLowerCase();
    return PACIENTES_MOCK.filter(
      (p) =>
        p.nombre.toLowerCase().includes(busqueda) ||
        p.apellido.toLowerCase().includes(busqueda) ||
        p.especialidadAsignada.toLowerCase().includes(busqueda)
    );
  }, [terminoBusqueda]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Directorio de Pacientes</h1>
        <p className="text-slate-500 mt-1">Gestiona y visualiza la información de los pacientes.</p>
      </header>

      <BuscadorPacientes 
        value={terminoBusqueda} 
        onChange={setTerminoBusqueda} 
      />

      {/* Layout Responsivo: 1 columna en móvil, 2 en tablet, 3 en desktop */}
      {pacientesFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacientesFiltrados.map((paciente) => (
            <PacienteCard key={paciente.id} paciente={paciente} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-lg">No se encontraron pacientes con ese criterio.</p>
        </div>
      )}
    </div>
  );
}