import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Paciente } from '../types';
// Renombramos 'create' del servicio para evitar conflicto con el 'create' de zustand
import { getAll, create as createPaciente, update, remove } from '../services/pacientes';
import { extraerMensajeError } from '../lib/errorHandler';

interface PacientesState {
  pacientes: Paciente[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  crear: (data: Omit<Paciente, 'id' | 'createdAt'>) => Promise<void>;
  actualizar: (id: number, data: Partial<Omit<Paciente, 'id' | 'createdAt'>>) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      cargando: false,
      error: null,
      
      cargar: async () => {
        set({ cargando: true, error: null }, false, 'cargar/start');
        try {
          const res = await getAll();
          const datos = res.data.map((p) => ({ ...p, estado: p.estado || 'activo' }));
          set({ pacientes: datos, cargando: false }, false, 'cargar/success');
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false }, false, 'cargar/error');
        }
      },

      crear: async (data) => {
        try {
          const res = await createPaciente(data);
          set((state) => ({ 
            pacientes: [...state.pacientes, { ...res.data, estado: 'activo' }] 
          }), false, 'crear/success');
        } catch (err) {
          set({ error: extraerMensajeError(err) }, false, 'crear/error');
          throw err;
        }
      },

      actualizar: async (id, data) => {
        try {
          await update(id, data);
          set((state) => ({
            pacientes: state.pacientes.map((p) => (p.id === id ? { ...p, ...data } : p)),
          }), false, 'actualizar/success');
        } catch (err) {
          set({ error: extraerMensajeError(err) }, false, 'actualizar/error');
          throw err;
        }
      },

      eliminar: async (id) => {
        try {
          await remove(id);
          set((state) => ({
            pacientes: state.pacientes.filter((p) => p.id !== id),
          }), false, 'eliminar/success');
        } catch (err) {
          set({ error: extraerMensajeError(err) }, false, 'eliminar/error');
          throw err;
        }
      },
    }),
    { name: 'PacientesStore' }
  )
);