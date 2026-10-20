import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { create } from '../services/pacientes';
import { extraerMensajeError } from '../lib/errorHandler';


// Esquema de validación con Zod
const pacienteSchema = z.object({
  firstName: z.string().min(2, 'El nombre es obligatorio'),
  lastName: z.string().min(2, 'El apellido es obligatorio'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
});

type PacienteFormValues = z.infer<typeof pacienteSchema>;

export function PaginaCrearPaciente() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema),
  });

  const onSubmit = async (data: PacienteFormValues) => {
    setCargando(true);
    try {
      // Agregar hora 00:00:00 a la fecha para que sea un DateTime válido
      const pacienteConFechaCompleta = {
        ...data,
        birthDate: new Date(data.birthDate).toISOString(), // Convierte a ISO completo
      };
      
      await create(pacienteConFechaCompleta);
      toast.success('Paciente registrado exitosamente');
      reset();
      navigate('/pacientes');
    } catch (err) {
      const mensaje = extraerMensajeError(err);
      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/pacientes')}
        className="mb-6 text-slate-600 hover:text-slate-900 flex items-center gap-2"
      >
        ← Volver a pacientes
      </button>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Nuevo Paciente</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                {...register('firstName')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.firstName && <p className="text-rose-600 text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input
                {...register('lastName')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.lastName && <p className="text-rose-600 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.email && <p className="text-rose-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                {...register('phone')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.phone && <p className="text-rose-600 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                {...register('birthDate')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.birthDate && <p className="text-rose-600 text-sm mt-1">{errors.birthDate.message}</p>}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/pacientes')}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {cargando && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {cargando ? 'Guardando...' : 'Guardar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}