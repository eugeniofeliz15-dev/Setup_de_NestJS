import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/axios';
import { extraerMensajeError } from '../lib/errorHandler';

interface UseApiResult<T> {
  data: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
}

export function useApi<T>(url: string): UseApiResult<T> {
  const [resultado, setResultado] = useState<{
    data: T | null;
    cargando: boolean;
    error: string | null;
    url: string | null;
  }>({ data: null, cargando: true, error: null, url: null });
  const [intento, setIntento] = useState(0);

  const recargar = useCallback(() => {
    setResultado((actual) => ({ ...actual, cargando: true, error: null }));
    setIntento((actual) => actual + 1);
  }, []);

  useEffect(() => {
    let vigente = true;

    const cargar = async () => {
      try {
        const response = await api.get<T>(url);
        if (vigente) {
          setResultado({ data: response.data, cargando: false, error: null, url });
        }
      } catch (err) {
        if (vigente) {
          setResultado((actual) => ({
            ...actual,
            cargando: false,
            error: extraerMensajeError(err),
            url,
          }));
        }
      }
    };

    void cargar();

    return () => {
      vigente = false;
    };
  }, [url, intento]);

  return {
    data: resultado.data,
    cargando: resultado.cargando || resultado.url !== url,
    error: resultado.error,
    recargar,
  };
}