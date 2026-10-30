export type TipoAlerta = 'info' | 'exito' | 'advertencia' | 'error';

interface AlertaBannerProps {
  tipo: TipoAlerta;
  mensaje: string;
  className?: string;
}

const clasesPorTipo: Record<TipoAlerta, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  exito: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  advertencia: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
};

export function AlertaBanner({ tipo, mensaje, className = '' }: AlertaBannerProps) {
  return (
    <div
      role={tipo === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border p-4 ${clasesPorTipo[tipo]} ${className}`}
    >
      {mensaje}
    </div>
  );
}
