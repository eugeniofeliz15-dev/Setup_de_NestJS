import { Link } from 'react-router-dom';

export function PaginaSinAcceso() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Acceso Denegado</h1>
        <p className="text-slate-600 mb-6">
          No tienes los permisos necesarios para acceder a esta sección. 
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}