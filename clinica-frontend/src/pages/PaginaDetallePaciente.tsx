import { useParams, useNavigate, Link } from 'react-router-dom';
import { PACIENTES_INICIALES } from './PaginaPacientes'; 
import { BadgeEstado } from '../components/BadgeEstado';

export function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const paciente = PACIENTES_INICIALES.find((p) => p.id === id);

  if (!paciente) {
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
              {paciente.nombre} {paciente.apellido}
            </h1>
            <p className="text-slate-500">{paciente.especialidadAsignada}</p>
          </div>
          <BadgeEstado estado={paciente.estado} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Email</h3>
            <p className="text-slate-800">{paciente.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Teléfono</h3>
            <p className="text-slate-800">{paciente.telefono}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Última Cita</h3>
            <p className="text-slate-800">{paciente.ultimaCita}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">ID de Paciente</h3>
            <p className="text-slate-800 font-mono text-sm">{paciente.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}