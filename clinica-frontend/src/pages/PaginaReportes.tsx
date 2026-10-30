import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCitasStore } from '../stores/citasStore';
import { AlertaBanner, EstadoVacio } from '../shared/components/ui';

interface DatosEspecialidad {
  especialidad: string;
  total: number;
}

interface DatosPorDia {
  fecha: string;
  total: number;
}

export function PaginaReportes() {
  const citas = useCitasStore((s) => s.citas);
  const error = useCitasStore((s) => s.error);
  const cargar = useCitasStore((s) => s.cargar);
  const [cargando, setCargando] = useState(true);
  const [datosEspecialidades, setDatosEspecialidades] = useState<DatosEspecialidad[]>([]);
  const [datosPorDia, setDatosPorDia] = useState<DatosPorDia[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await cargar();
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [cargar]);

  // Transformar datos para gráficas (simulando datos reales)
  useEffect(() => {
    if (citas.length > 0) {
      // Datos por especialidad (mock - en producción vendrían del backend)
      const especialidadesMap = new Map<string, number>();
      citas.forEach((cita) => {
        const especialidad = `Especialidad ${cita.medicoId}`;
        especialidadesMap.set(
          especialidad,
          (especialidadesMap.get(especialidad) || 0) + 1
        );
      });
      
      const datosEsp: DatosEspecialidad[] = Array.from(especialidadesMap.entries()).map(
        ([especialidad, total]) => ({ especialidad, total })
      );
      setDatosEspecialidades(datosEsp);

      // Datos por día (últimos 7 días)
      const diasMap = new Map<string, number>();
      const hoy = new Date();
      
      // Inicializar últimos 7 días
      for (let i = 6; i >= 0; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - i);
        const key = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        diasMap.set(key, 0);
      }

      // Contar citas por día
      citas.forEach((cita) => {
        const fechaCita = new Date(cita.scheduledAt);
        const key = fechaCita.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        if (diasMap.has(key)) {
          diasMap.set(key, diasMap.get(key)! + 1);
        }
      });

      const datosDia: DatosPorDia[] = Array.from(diasMap.entries()).map(([fecha, total]) => ({
        fecha,
        total,
      }));
      setDatosPorDia(datosDia);
    }
  }, [citas]);

  if (cargando) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Reportes</h1>
        <div className="space-y-6">
          {/* Skeleton para BarChart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-4"></div>
            <div className="h-64 bg-slate-100 rounded animate-pulse"></div>
          </div>
          {/* Skeleton para LineChart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-4"></div>
            <div className="h-64 bg-slate-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Reportes</h1>
        <AlertaBanner tipo="error" mensaje={`No se pudieron cargar los datos de reportes: ${error}`} />
      </div>
    );
  }

  if (citas.length === 0) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Reportes</h1>
        <EstadoVacio
          titulo="No hay datos disponibles para mostrar reportes"
          descripcion="Registra citas para generar reportes."
        >
          <Link to="/citas" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Ir a Citas
          </Link>
        </EstadoVacio>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Reportes</h1>
        <Link to="/dashboard" className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          ← Volver al Dashboard
        </Link>
      </div>

      <div className="space-y-6">
        {/* Gráfica de Barras: Citas por Especialidad */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Citas por Especialidad
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosEspecialidades}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="especialidad" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="total" fill="#4f46e5" name="Total de Citas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de Línea: Citas por Día (últimos 7 días) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Citas por Día (Últimos 7 días)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="fecha" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Citas"
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}