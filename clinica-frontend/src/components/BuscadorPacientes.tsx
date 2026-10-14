interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
}

export function BuscadorPacientes({ value, onChange }: BuscadorPacientesProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o especialidad..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
      />
    </div>
  );
}