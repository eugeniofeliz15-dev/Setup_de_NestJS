import { api } from '../lib/axios';
import type { Cita, RespuestaPaginada } from '../types';

export const getAll = () => api.get<Cita[]>('/citas');

export interface CargarCitasPaginadasParams {
  pagina: number;
  estado?: Cita['status'];
  signal?: AbortSignal;
}

export const cargarCitasPaginadas = async ({
  pagina,
  estado,
  signal,
}: CargarCitasPaginadasParams): Promise<RespuestaPaginada<Cita>> => {
  const { data } = await api.get<RespuestaPaginada<Cita>>('/citas/historial', {
    params: { pagina, estado },
    signal,
  });
  return data;
};

export const updateEstado = (id: number, status: Cita['status']) => 
  api.patch<Cita>(`/citas/${id}/estado`, { status });