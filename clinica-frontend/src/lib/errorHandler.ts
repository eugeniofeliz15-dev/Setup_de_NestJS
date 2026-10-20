export function extraerMensajeError(err: unknown): string {
  if (err instanceof Error) {
    // Si es un error de Axios, intentamos sacar el mensaje del backend
    if ('response' in err && err.response && typeof err.response === 'object' && 'data' in err.response) {
      const data = (err.response as { data: unknown }).data;
      if (data && typeof data === 'object' && 'message' in data) {
        return (data as { message: string }).message;
      }
    }
    return err.message;
  }
  return 'Ocurrió un error inesperado';
}