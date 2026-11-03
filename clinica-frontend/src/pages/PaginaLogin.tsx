import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bootstrapGerencia, login } from '../services/auth';
import { useAuthStore } from '../stores/authStore';
import {
  bootstrapGerenciaSchema,
  loginSchema,
  type BootstrapGerenciaFormData,
  type LoginFormData,
} from '../schemas/loginSchema';
import { extraerMensajeError } from '../lib/errorHandler';

export function PaginaLogin() {
  const [mostrarBootstrap, setMostrarBootstrap] = useState(false);
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginEnviando },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const {
    register: registerBootstrap,
    handleSubmit: handleBootstrapSubmit,
    formState: { errors: bootstrapErrors, isSubmitting: bootstrapEnviando },
  } = useForm<BootstrapGerenciaFormData>({
    resolver: zodResolver(bootstrapGerenciaSchema),
  });

  const { login: setAuth } = useAuthStore();
  const navigate = useNavigate();

  const iniciarSesion = async (datos: LoginFormData) => {
    try {
      const { token, usuario } = await login(datos);
      setAuth(token, usuario);
      toast.success('¡Bienvenido!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  };

  const crearGerenciaInicial = async (datos: BootstrapGerenciaFormData) => {
    try {
      const { token, usuario } = await bootstrapGerencia(datos);
      setAuth(token, usuario);
      toast.success('Cuenta de gerencia creada. ¡Bienvenido!');
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

        {!mostrarBootstrap ? (
          <form
            onSubmit={handleLoginSubmit(iniciarSesion)}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                {...registerLogin('email')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="tu@email.com"
              />
              {loginErrors.email && (
                <p className="mt-1 text-sm text-rose-600">
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...registerLogin('password')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="••••••••"
              />
              {loginErrors.password && (
                <p className="mt-1 text-sm text-rose-600">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginEnviando}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-60"
            >
              {loginEnviando ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
            <div className="text-center text-sm text-slate-600">
              <p>¿Primera configuración de la clínica?</p>
              <button
                type="button"
                onClick={() => setMostrarBootstrap(true)}
                className="mt-1 font-medium text-indigo-600 hover:text-indigo-700"
              >
                Crear cuenta inicial de gerencia
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleBootstrapSubmit(crearGerenciaInicial)}
            className="space-y-5"
          >
            <p className="text-sm text-slate-600">
              Esta opción solo crea la primera cuenta GERENCIA y requiere el
              código secreto configurado en el backend.
            </p>
            <div>
              <label
                htmlFor="bootstrap-email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Correo electrónico
              </label>
              <input
                id="bootstrap-email"
                type="email"
                autoComplete="email"
                {...registerBootstrap('email')}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="tu@email.com"
              />
              {bootstrapErrors.email && (
                <p className="mt-1 text-sm text-rose-600">
                  {bootstrapErrors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="bootstrap-password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Contraseña (mínimo 8 caracteres)
              </label>
              <input
                id="bootstrap-password"
                type="password"
                autoComplete="new-password"
                {...registerBootstrap('password')}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Crea una contraseña segura"
              />
              {bootstrapErrors.password && (
                <p className="mt-1 text-sm text-rose-600">
                  {bootstrapErrors.password.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="bootstrap-token"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Código de configuración
              </label>
              <input
                id="bootstrap-token"
                type="password"
                autoComplete="off"
                {...registerBootstrap('setupToken')}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Código secreto guardado en Render"
              />
              {bootstrapErrors.setupToken && (
                <p className="mt-1 text-sm text-rose-600">
                  {bootstrapErrors.setupToken.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={bootstrapEnviando}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
            >
              {bootstrapEnviando
                ? 'Creando cuenta...'
                : 'Crear cuenta de gerencia'}
            </button>
            <button
              type="button"
              onClick={() => setMostrarBootstrap(false)}
              className="w-full px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Volver al inicio de sesión
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
