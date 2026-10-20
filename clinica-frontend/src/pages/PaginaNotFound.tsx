import { Link } from 'react-router-dom';

export function PaginaNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="text-6xl mb-4">🚧</div>
      <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-slate-600 mb-6">La página que buscas no existe o fue movida.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Ir al inicio
      </Link>
    </div>
  );
}