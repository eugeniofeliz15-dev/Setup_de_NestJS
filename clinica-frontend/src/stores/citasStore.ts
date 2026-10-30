import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Cita, RespuestaPaginada } from '../types';
import { cargarCitasPaginadas as solicitarCitasPaginadas, getAll, updateEstado } from '../services/citas';
import type { CargarCitasPaginadasParams } from '../services/citas';
import { extraerMensajeError } from '../lib/errorHandler';

interface CitasState {
  citas: Cita[];
  citaSeleccionada: Cita | null;
  cargando: boolean;
  error: string | null; // ✅ Agregado
  cargar: () => Promise<void>;
  cargarCitasPaginadas: (params: CargarCitasPaginadasParams) => Promise<RespuestaPaginada<Cita>>;
  seleccionar: (id: number) => void;
  actualizarEstado: (id: number, status: Cita['status']) => Promise<void>;
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,
      error: null, // ✅ Agregado

      cargar: async () => {
        set({ cargando: true, error: null }, false, 'cargar/start');
        try {
          const res = await getAll();
          set({ citas: res.data, cargando: false }, false, 'cargar/success');
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false }, false, 'cargar/error');
        }
      },

      cargarCitasPaginadas: (params) => solicitarCitasPaginadas(params),

      seleccionar: (id) => {
        const cita = get().citas.find((c) => c.id === id) || null;
        set({ citaSeleccionada: cita }, false, 'seleccionar');
      },

      actualizarEstado: async (id, status) => {
        const citaOriginal = get().citas.find((c) => c.id === id);
        if (!citaOriginal) return;

        set((state) => ({
          citas: state.citas.map((c) => (c.id === id ? { ...c, status } : c)),
        }), false, 'actualizarEstado/optimistic');

        try {
          await updateEstado(id, status);
        } catch (err) {
          set((state) => ({
            citas: state.citas.map((c) => (c.id === id ? citaOriginal : c)),
          }), false, 'actualizarEstado/revert');
          throw err;
        }
      },
    }),
    { name: 'CitasStore' }
  )
);