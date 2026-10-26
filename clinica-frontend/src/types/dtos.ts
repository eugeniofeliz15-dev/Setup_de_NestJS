import type { Paciente, Cita, Medico } from './index';

// DTOs para Pacientes
export type CrearPacienteDTO = Omit<Paciente, 'id' | 'createdAt'>;
export type ActualizarPacienteDTO = Partial<Omit<Paciente, 'id'>>;
export type ResumenPaciente = Pick<Paciente, 'id' | 'firstName' | 'lastName' | 'email'>;

// DTOs para Citas
export type CrearCitaDTO = Omit<Cita, 'id'>;
export type ActualizarCitaDTO = Partial<Omit<Cita, 'id'>>;
export type ResumenCita = Pick<Cita, 'id' | 'pacienteId' | 'medicoId' | 'scheduledAt' | 'status'>;

// DTOs para Médicos
export type CrearMedicoDTO = Omit<Medico, 'id'>;
export type ActualizarMedicoDTO = Partial<Omit<Medico, 'id'>>;
export type ResumenMedico = Pick<Medico, 'id' | 'firstName' | 'lastName' | 'especialidad'>;