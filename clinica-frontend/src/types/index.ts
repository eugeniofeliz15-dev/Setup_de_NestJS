export type EstadoPaciente = 'activo' | 'inactivo' | 'en_espera';

export type Tendencia = 'positiva' | 'negativa' | 'neutra';

export interface Paciente {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  estado?: EstadoPaciente;
  createdAt?: string;
}

export interface Medico {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  especialidad: string;
}

export interface Cita {
  id: number;
  pacienteId: number;
  medicoId: number;
  fecha: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface Metrica {
  id: string;
  titulo: string;
  valor: number;
  descripcion: string;
  tendencia: Tendencia;
  icono: string;
}