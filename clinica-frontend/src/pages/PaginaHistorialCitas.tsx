import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCitasStore } from '../stores/citasStore';
import type { RespuestaPaginada } from '../types/api';
import type { Cita } from '../types';
import { extraerMensajeError } from '../lib/errorHandler';

const estados = [
  { label: 'Todos', value: undefined },
  { label: 'Programada', value: 'SCHEDULED' },
  { label: 'Completada', value: 'COMPLETED' },
  { label: 'Cancelada', value: 'CANCELLED' },
] as const;

type EstadoFiltro = (typeof estados)[number]['label'];

interface ResultadoHistorial {
  clave: string;
  datos?: RespuestaPaginada<Cita>;
  error?: string;
}

function esEstadoFiltro(value: string | null): value is EstadoFiltro {
  return estados.some((estado) => estado.label === value);
}

function obtenerEstadoFiltro(value: string | null): EstadoFiltro {
  return esEstadoFiltro(value) ? value : 'Todos';
}

function obtenerEstadoApi(estado: EstadoFiltro): Cita['status'] | undefined {
  return estados.find((opcion) => opcion.label === estado)?.value;
}

export function PaginaHistorialCitas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paginaParam = Number(searchParams.get('pagina'));
  const pagina = Number.isInteger(paginaParam) && paginaParam > 0 ? paginaParam : 1;
  const estado = obtenerEstadoFiltro(searchParams.get('estado'));
  const cargarCitasPaginadas = useCitasStore((store) => store.cargarCitasPaginadas);
  const [resultado, setResultado] = useState<ResultadoHistorial | null>(null);
  const clave = `${pagina}:${estado}`;
  const cargando = resultado?.clave !== clave;
  const datos = resultado?.clave === clave ? resultado.datos : undefined;
  const error = resultado?.clave === clave ? resultado.error : undefined;

  useEffect(() => {
    const controller = new AbortController();

    cargarCitasPaginadas({
      pagina,
      estado: obtenerEstadoApi(estado),
      signal: controller.signal,
    })
      .then((respuesta) => {
        setResultado({ clave, datos: respuesta });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || axios.isCancel(err)) return;
        setResultado({ clave, error: extraerMensajeError(err) });
      });

    return () => controller.abort();
  }, [cargarCitasPaginadas, clave, estado, pagina]);

  const handleCambiarEstado = (nuevoEstado: EstadoFiltro) => {
    setSearchParams({
      pagina: '1',
      estado: nuevoEstado,
    });
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setSearchParams({
      pagina: String(nuevaPagina),
      estado,
    });
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Historial de Citas</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {estados.map(({ label }) => (
          <button
            key={label}
            type="button"
            onClick={() => handleCambiarEstado(label)}
            aria-pressed={estado === label}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              estado === label
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {cargando && (
        <div className="space-y-3" aria-label="Cargando citas">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      )}

      {!cargando && error && (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
          No se pudo cargar el historial: {error}
        </div>
      )}

      {!cargando && !error && datos && datos.data.length > 0 && (
        <div className="mb-6 space-y-3">
          {datos.data.map((cita) => (
            <div
              key={cita.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-800">Cita #{cita.id}</p>
                <p className="text-sm text-slate-500">
                  {new Date(cita.scheduledAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  cita.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-700'
                    : cita.status === 'CANCELLED'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {estados.find((opcion) => opcion.value === cita.status)?.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {!cargando && !error && datos?.data.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white py-12 text-center">
          <p className="text-slate-500">No se encontraron citas con este filtro.</p>
        </div>
      )}

      {!cargando && !error && datos && datos.totalPaginas > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-4 sm:flex-row">
          <p className="text-sm text-slate-600">
            Página {datos.pagina} de {datos.totalPaginas} — {datos.total} registros
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleCambiarPagina(datos.pagina - 1)}
              disabled={datos.pagina <= 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => handleCambiarPagina(datos.pagina + 1)}
              disabled={datos.pagina >= datos.totalPaginas}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
