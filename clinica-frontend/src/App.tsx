import type { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RutaProtegida } from './components/RutaProtegida';
import { PaginaDashboard } from './pages/PaginaDashboard';
import { PaginaPacientes } from './pages/PaginaPacientes';
import { PaginaCrearPaciente } from './pages/PaginaCrearPaciente';
import { PaginaDetallePaciente } from './pages/PaginaDetallePaciente';
import { PaginaCitas } from './pages/PaginaCitas';
import { PaginaNuevaCita } from './pages/PaginaNuevaCita';
import { PaginaLogin } from './pages/PaginaLogin';
import { PaginaNotFound } from './pages/PaginaNotFound';
import { PaginaReportes } from './pages/PaginaReportes';
import { PaginaSinAcceso } from './pages/PaginaSinAcceso';
import { PaginaPerfil } from './pages/PaginaPerfil';
import { PaginaHistorialCitas } from './pages/PaginaHistorialCitas';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { AlertaBanner } from './shared/components/ui';

function conLimiteDeError(contenido: ReactNode, mensaje: string) {
  return (
    <ErrorBoundary fallback={<AlertaBanner tipo="error" mensaje={mensaje} />}>
      {contenido}
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

      {/* 1. Protección general: Requiere estar autenticado */}
      <Route element={<RutaProtegida />}>
        <Route path="/" element={<Layout />}>
          <Route path="perfil" element={conLimiteDeError(<PaginaPerfil />, 'Error al cargar el perfil.')} />
          <Route index element={conLimiteDeError(<PaginaDashboard />, 'Error al cargar el dashboard.')} />
          <Route path="pacientes" element={conLimiteDeError(<PaginaPacientes />, 'Error al cargar pacientes.')} />
          <Route path="pacientes/nuevo" element={conLimiteDeError(<PaginaCrearPaciente />, 'Error al cargar el formulario.')} />
          <Route path="pacientes/:id" element={conLimiteDeError(<PaginaDetallePaciente />, 'Error al cargar el paciente.')} />
          <Route path="citas" element={conLimiteDeError(<PaginaCitas />, 'Error al cargar citas.')} />
          <Route path="citas/nueva" element={conLimiteDeError(<PaginaNuevaCita />, 'Error al cargar el formulario de citas.')} />
          <Route path="historial" element={conLimiteDeError(<PaginaHistorialCitas />, 'Error al cargar el historial.')} />
          
          {/* 2. Protección por rol: Requiere estar autenticado Y tener el rol específico */}
          <Route element={<RutaProtegida rolesPermitidos={['GERENCIA', 'ADMIN']} />}>
            <Route
              path="reportes"
              element={conLimiteDeError(<PaginaReportes />, 'Error al cargar reportes.')}
            />
          </Route>
          
          <Route path="*" element={conLimiteDeError(<PaginaNotFound />, 'Error al cargar esta página.')} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;