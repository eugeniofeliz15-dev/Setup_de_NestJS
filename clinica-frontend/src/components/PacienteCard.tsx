import type { Paciente, EstadoPaciente } from '../types';
import { BadgeEstado } from './BadgeEstado';

interface PacienteCardProps {
  paciente: Paciente;
  onCambiarEstado: (id: number, estado: EstadoPaciente) => void;
  onEliminar: (id: number) => void;
}

export function PacienteCard({ paciente, onCambiarEstado, onEliminar }: PacienteCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {paciente.firstName} {paciente.lastName}
          </h3>
          {/* Se eliminó la línea de especialidadAsignada porque no existe en el tipo */}
        </div>
        <BadgeEstado estado={paciente.estado || 'activo'} />
      </div>
      
      <div className="space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-3">
        <div className="flex justify-between">
          <span> Email:</span>
          <span className="font-medium text-slate-800 truncate max-w-[150px]">{paciente.email}</span>
        </div>
        <div className="flex justify-between">
          <span>📱 Teléfono:</span>
          <span className="font-medium text-slate-800">{paciente.phone}</span>
        </div>
        <div className="flex justify-between">
          <span>📅 Fecha nacimiento:</span>
          <span className="font-medium text-slate-800">
            {new Date(paciente.birthDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100 mt-auto">
        <select
          value={paciente.estado || 'activo'}
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
    </div>
  );
}