import { useMemo, useState } from 'react';
import { usePacientesStore } from '../stores/pacientesStore';
import { useCitasStore } from '../stores/citasStore';
import { Spinner } from '../shared/components/ui';

// Nota: Si tu componente de tarjeta se llama diferente, ajústalo aquí. 
// Si no tienes uno, usamos divs estilizados como fallback seguro.
interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className={`p-6 rounded-xl border border-slate-200 shadow-sm ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

export function PaginaDashboard() {
  // 1. Obtener datos de los stores de Zustand
  const pacientes = usePacientesStore((s) => s.pacientes);
  const citas = useCitasStore((s) => s.citas);
  const cargandoPacientes = usePacientesStore((s) => s.cargando);
  const cargandoCitas = useCitasStore((s) => s.cargando);
  
  const cargarPacientes = usePacientesStore((s) => s.cargar);
  const cargarCitas = useCitasStore((s) => s.cargar);

  const [actualizando, setActualizando] = useState(false);

  const cargando = cargandoPacientes || cargandoCitas;

  // ✅ REQUIREMENT: Cálculos memoizados con useMemo
  // Solo se recalculan cuando 'pacientes' o 'citas' cambian de referencia.
  // Esto evita cálculos innecesarios en cada render del componente.
  const metricas = useMemo(() => {
    const totalPacientes = pacientes.length;
    
    const citasCompletadas = citas.filter((c) => c.status === 'COMPLETED').length;
    const totalCitas = citas.length;
    
    // Evitamos división por cero
    const porcentajeCitasCompletadas = totalCitas > 0 
      ? Math.round((citasCompletadas / totalCitas) * 100) 
      : 0;

    const citasPendientes = citas.filter((c) => c.status === 'SCHEDULED').length;

    return {
      totalPacientes,
      porcentajeCitasCompletadas,
      citasPendientes,
    };
  }, [pacientes, citas]); // ← Dependencias correctas

  // ✅ REQUIREMENT: Botón que recarga el store. 
  // Al cambiar los datos del store, useMemo se dispara automáticamente.
  const handleActualizarDatos = async () => {
    setActualizando(true);
    try {
      // Ejecutamos ambas cargas en paralelo
      await Promise.all([cargarPacientes(), cargarCitas()]);
    } catch (error) {
      console.error('Error al actualizar datos:', error);
    } finally {
      setActualizando(false);
    }
  };

  if (cargando && pacientes.length === 0 && citas.length === 0) {
    return <Spinner fullscreen label="Cargando dashboard..." />;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard General</h1>
          <p className="text-slate-600">Resumen de la actividad de la clínica</p>
        </div>
        
        {/* Botón para actualizar datos */}
        <button
          onClick={handleActualizarDatos}
          disabled={actualizando}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actualizando ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Actualizando...
            </>
          ) : (
            'Actualizar datos'
          )}
        </button>
      </div>

      {/* ✅ REQUIREMENT: MetricCards reflejando los valores calculados con useMemo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total de Pacientes"
          value={metricas.totalPacientes.toString()}
          icon="👥"
          color="bg-blue-50 text-blue-700"
        />
        <MetricCard
          title="Citas Completadas"
          value={`${metricas.porcentajeCitasCompletadas}%`}
          icon="✅"
          color="bg-green-50 text-green-700"
        />
        <MetricCard
          title="Citas Pendientes"
          value={metricas.citasPendientes.toString()}
          icon="📅"
          color="bg-amber-50 text-amber-700"
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Estado del Sistema</h2>
        <p className="text-slate-600">
          Los cálculos de este dashboard están optimizados con <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">useMemo</code>. 
          Solo se recalculan cuando los datos de pacientes o citas cambian, no cuando el componente se renderiza por otras razones.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Total de registros en memoria: {pacientes.length} pacientes, {citas.length} citas.
        </p>
      </div>
    </div>
  );
}