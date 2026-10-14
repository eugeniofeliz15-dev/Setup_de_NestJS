import type { Paciente } from '../types/paciente';
import { BadgeEstado } from './BadgeEstado';

interface PacienteCardProps {
  paciente: Paciente;
}

export function PacienteCard({ paciente }: PacienteCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {paciente.nombre} {paciente.apellido}
          </h3>
          <p className="text-sm text-slate-500">{paciente.especialidadAsignada}</p>
        </div>
        <BadgeEstado estado={paciente.estado} />
      </div>
      
      <div className="space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-3 mt-1">
        <div className="flex justify-between">
          <span>📧 Email:</span>
          <span className="font-medium text-slate-800">{paciente.email}</span>
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
    </div>
  );
}