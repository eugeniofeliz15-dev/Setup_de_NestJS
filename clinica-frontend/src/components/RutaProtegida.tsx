import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

export function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { isAuthenticated, usuario } = useAuthStore();

  // 1. Si no está autenticado, mandar al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si se requieren roles específicos y el usuario no tiene uno de ellos
  if (rolesPermitidos && usuario && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/sin-acceso" replace />;
  }

  // 3. Si pasa las verificaciones, renderizar las rutas hijas
  return <Outlet />;
}