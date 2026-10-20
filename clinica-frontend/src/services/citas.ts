import { api } from '../lib/axios';
import type { Cita } from '../types';

export const getAll = () => api.get<Cita[]>('/citas');

export const updateEstado = (id: number, status: Cita['status']) => 
  api.patch<Cita>(`/citas/${id}/estado`, { status });