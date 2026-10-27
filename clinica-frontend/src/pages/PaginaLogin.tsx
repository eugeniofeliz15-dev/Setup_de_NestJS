import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../services/auth';
import { useAuthStore } from '../stores/authStore';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';
import { extraerMensajeError } from '../lib/errorHandler';

export function PaginaLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { login: setAuth } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (datos: LoginFormData) => {
    try {
      const { token, usuario } = await login(datos);
      setAuth(token, usuario);
      toast.success('¡Bienvenido!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Clínica Salud</h1>
          <p className="text-slate-600 mt-2">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>
            )}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <p>Demo credentials:</p>
          <p className="font-mono text-xs mt-1">email: admin@clinica.com</p>
          <p className="font-mono text-xs">password: 123456</p>
        </div>
      </div>
    </div>
  );
}