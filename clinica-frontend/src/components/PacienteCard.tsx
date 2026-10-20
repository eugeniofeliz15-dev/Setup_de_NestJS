import type { Paciente, EstadoPaciente } from '../types/paciente';
import { BadgeEstado } from './BadgeEstado';
import { Link } from 'react-router-dom';

interface PacienteCardProps {
  paciente: Paciente;
  onCambiarEstado: (id: string, estado: EstadoPaciente) => void;
  onEliminar: (id: string) => void;
}

export function PacienteCard({ paciente, onCambiarEstado, onEliminar }: PacienteCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {paciente.nombre} {paciente.apellido}
          </h3>
          <p className="text-sm text-slate-500">{paciente.especialidadAsignada}</p>
        </div>
        <BadgeEstado estado={paciente.estado} />
      </div>
      
      <div className="space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-3">
        <div className="flex justify-between">
          <span>📧 Email:</span>
          <span className="font-medium text-slate-800 truncate max-w-[150px]">{paciente.email}</span>
        </div>
        <div className="flex justify-between">
          <span>📱 Teléfono:</span>
          <span className="font-medium text-slate-800">{paciente.telefono}</span>
        </div>
        <div className="flex justify-between">
          <span>📅 Última cita:</span>
          <span className="font-medium text-slate-800">{paciente.ultimaCita}</span>
        </div>
      </div>

      {/* Contenedor Flex para las acciones rápidas */}
      <div className="flex gap-2 pt-2 border-t border-slate-100 mt-auto">
        <select
          value={paciente.estado}
          onChange={(e) => onCambiarEstado(paciente.id, e.target.value as EstadoPaciente)}
          className="flex-1 text-sm border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="en_espera">En espera</option>
        </select>
        
        <button
          onClick={() => onEliminar(paciente.id)}
          className="px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
        >
          Eliminar
        </button>
      </div>

      {/* El Link va FUERA del flex, ocupando todo el ancho al final de la tarjeta */}
      <Link
        to={`/pacientes/${paciente.id}`}
        className="block w-full text-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
      >
        Ver detalle →
      </Link>
    </div>
  );
}