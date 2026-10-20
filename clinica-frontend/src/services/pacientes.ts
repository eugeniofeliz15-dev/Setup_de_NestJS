import { api } from '../lib/axios';
import type { Paciente } from '../types';

export const getAll = () => api.get<Paciente[]>('/pacientes');

export const getById = (id: number) => api.get<Paciente>(`/pacientes/${id}`);

export const create = (data: Omit<Paciente, 'id' | 'createdAt'>) => 
  api.post<Paciente>('/pacientes', data);

export const update = (id: number, data: Partial<Omit<Paciente, 'id' | 'createdAt'>>) => 
  api.put<Paciente>(`/pacientes/${id}`, data);

export const remove = (id: number) => 
  api.delete(`/pacientes/${id}`);