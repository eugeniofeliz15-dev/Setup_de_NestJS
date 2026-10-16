import { useState, useEffect } from 'react';

export interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
}

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simulamos una petición a la API con 800ms de delay
    const timer = setTimeout(() => {
      setMedicos([
        { id: '1', nombre: 'Dr. Juan Pérez', especialidad: 'Cardiología' },
        { id: '2', nombre: 'Dra. María López', especialidad: 'Pediatría' },
        { id: '3', nombre: 'Dr. Carlos Ruiz', especialidad: 'Dermatología' },
        { id: '4', nombre: 'Dra. Ana García', especialidad: 'Neurología' },
      ]);
      setCargando(false);
    }, 800);

    // Cleanup: cancela el timer si el componente se desmonta antes de los 800ms
    return () => clearTimeout(timer);
  }, []);

  return { medicos, cargando };
}