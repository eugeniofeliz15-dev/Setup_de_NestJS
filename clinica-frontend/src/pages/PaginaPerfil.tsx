import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { perfilSchema, type PerfilFormData } from '../schemas/perfilSchema';
import { InputFotoPerfil } from '../components/InputFotoPerfil';
import { extraerMensajeError } from '../lib/errorHandler';
import { actualizarPerfil } from '../services/auth';

export function PaginaPerfil() {
  const { usuario, actualizarUsuario } = useAuthStore();
  const navigate = useNavigate();
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: usuario?.nombre || '',
      email: usuario?.email || '',
      telefono: usuario?.telefono || '',
    }
  });

  const onSubmit = async (datos: PerfilFormData) => {
    const formData = new FormData();
    formData.append('nombre', datos.nombre);
    formData.append('email', datos.email);
    if (datos.telefono) formData.append('telefono', datos.telefono);
    if (archivoFoto) formData.append('foto', archivoFoto);

    try {
      const usuarioActualizado = await actualizarPerfil(formData);
      actualizarUsuario(usuarioActualizado);
      toast.success('Perfil actualizado correctamente');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Editar Perfil</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <InputFotoPerfil 
          fotoActual={usuario?.foto}
          onChange={setArchivoFoto} 
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nombre completo</label>
          <input
            {...register('nombre')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.nombre && <p className="mt-1 text-sm text-rose-600">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Correo electrónico</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono (opcional)</label>
          <input
            {...register('telefono')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="8-15 dígitos"
          />
          {errors.telefono && <p className="mt-1 text-sm text-rose-600">{errors.telefono.message}</p>}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}