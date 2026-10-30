import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/axios';

interface InputFotoPerfilProps {
  fotoActual?: string | null;
  onChange: (archivo: File | null) => void;
}

export function InputFotoPerfil({ fotoActual, onChange }: InputFotoPerfilProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const handleSeleccion = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      onChange(null);
      setPreview(null);
      e.target.value = '';
      return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB');
      onChange(null);
      setPreview(null);
      e.target.value = '';
      return;
    }

    setPreview(URL.createObjectURL(archivo));
    onChange(archivo);
  };

  const apiBaseUrl = api.defaults.baseURL ?? window.location.origin;
  const fotoSrc = preview
    || (fotoActual ? new URL(fotoActual, apiBaseUrl).toString() : null);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 bg-slate-100 flex items-center justify-center">
        {fotoSrc ? (
          <img src={fotoSrc} alt="Foto de perfil" className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl text-slate-400" aria-hidden="true">👤</span>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSeleccion}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Cambiar foto
      </button>
    </div>
  );
}