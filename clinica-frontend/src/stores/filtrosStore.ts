import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EstadoPaciente } from '../types';

interface FiltrosState {
  queryPacientes: string;
  estadoFiltro: EstadoPaciente | 'todos';
  setQueryPacientes: (query: string) => void;
  setEstadoFiltro: (estado: EstadoPaciente | 'todos') => void;
  resetFiltros: () => void;
}

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      queryPacientes: '',
      estadoFiltro: 'todos',
      
      setQueryPacientes: (query) => set({ queryPacientes: query }, false, 'setQueryPacientes'),
      setEstadoFiltro: (estado) => set({ estadoFiltro: estado }, false, 'setEstadoFiltro'),
      resetFiltros: () => set({ queryPacientes: '', estadoFiltro: 'todos' }, false, 'resetFiltros'),
    }),
    { name: 'FiltrosStore' }
  )
);