import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/pacientes', label: 'Pacientes', icon: '👥' },
  { to: '/citas/nueva', label: 'Nueva Cita', icon: '📅' },
  { to: '/reportes', label: 'Reportes', icon: '📈' },
];

export function Layout() {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 hidden md:flex">
        <h1 className="text-xl font-bold text-slate-800 mb-8">Clínica Salud</h1>
        
        <nav className="flex flex-col gap-2 flex-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        
        {/* Sección de Usuario y Logout */}
        <div className="mt-auto pt-6 border-t border-slate-200">
          <div className="mb-4 px-2">
            <Link
              to="/perfil"
              className="mb-1 block truncate text-sm font-semibold text-indigo-600 hover:underline"
            >
              {usuario?.nombre || 'Usuario'}
            </Link>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {usuario?.rol || 'Rol'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors font-medium"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}