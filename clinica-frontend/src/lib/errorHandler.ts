import axios from 'axios';

export function extraerMensajeError(err: unknown): string {
  // Type guard de Axios
  if (axios.isAxiosError(err)) {
    // Error del backend con mensaje específico
    return err.response?.data?.message ?? err.message ?? 'Error del servidor';
  }
  
  // Error genérico de JavaScript
  if (err instanceof Error) {
    return err.message;
  }
  
  // Error desconocido
  return 'Error inesperado';
}