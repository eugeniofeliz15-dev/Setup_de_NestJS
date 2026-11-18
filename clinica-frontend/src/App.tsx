import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RutaProtegida } from './components/RutaProtegida';

// ✅ Importaciones NORMALES (NO lazy)
import { PaginaLogin } from './pages/PaginaLogin';
import { PaginaDashboard } from './pages/PaginaDashboard';

// ✅ Code Splitting con React.lazy (named exports → default)
const PaginaPacientes = lazy(() =>
  import('./pages/PaginaPacientes').then((m) => ({ default: m.PaginaPacientes })),
);
const PaginaCrearPaciente = lazy(() =>
  import('./pages/PaginaCrearPaciente').then((m) => ({ default: m.PaginaCrearPaciente })),
);
const PaginaDetallePaciente = lazy(() =>
  import('./pages/PaginaDetallePaciente').then((m) => ({ default: m.PaginaDetallePaciente })),
);
const PaginaCitas = lazy(() =>
  import('./pages/PaginaCitas').then((m) => ({ default: m.PaginaCitas })),
);
const PaginaNuevaCita = lazy(() =>
  import('./pages/PaginaNuevaCita').then((m) => ({ default: m.PaginaNuevaCita })),
);
const PaginaReportes = lazy(() =>
  import('./pages/PaginaReportes').then((m) => ({ default: m.PaginaReportes })),
);
const PaginaSinAcceso = lazy(() =>
  import('./pages/PaginaSinAcceso').then((m) => ({ default: m.PaginaSinAcceso })),
);
const PaginaPerfil = lazy(() =>
  import('./pages/PaginaPerfil').then((m) => ({ default: m.PaginaPerfil })),
);
const PaginaHistorialCitas = lazy(() =>
  import('./pages/PaginaHistorialCitas').then((m) => ({ default: m.PaginaHistorialCitas })),
);
const PaginaNotFound = lazy(() =>
  import('./pages/PaginaNotFound').then((m) => ({ default: m.PaginaNotFound })),
);

import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { AlertaBanner, Spinner } from './shared/components/ui';

// Helper para ErrorBoundary
function conLimiteDeError(contenido: ReactNode, mensaje: string) {
  return (
    <ErrorBoundary fallback={<AlertaBanner tipo="error" mensaje={mensaje} />}>
      {contenido}
    </ErrorBoundary>
  );
}

// ✅ Helper para Suspense (envuelve cada ruta lazy)
function conSuspense(contenido: ReactNode) {
  return <Suspense fallback={<Spinner fullscreen label="Cargando sección..." />}>{contenido}</Suspense>;
}

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/sin-acceso" element={conSuspense(<PaginaSinAcceso />)} />

      {/* Rutas protegidas */}
      <Route element={<RutaProtegida />}>
        <Route path="/" element={<Layout />}>
          {/* Dashboard NO es lazy (carga instantánea) */}
          <Route index element={conLimiteDeError(<PaginaDashboard />, 'Error al cargar el dashboard.')} />

          {/* Rutas lazy envueltas en Suspense individual */}
          <Route path="perfil" element={conSuspense(conLimiteDeError(<PaginaPerfil />, 'Error al cargar el perfil.'))} />
          <Route path="pacientes" element={conSuspense(conLimiteDeError(<PaginaPacientes />, 'Error al cargar pacientes.'))} />
          <Route path="pacientes/nuevo" element={conSuspense(conLimiteDeError(<PaginaCrearPaciente />, 'Error al cargar el formulario.'))} />
          <Route path="pacientes/:id" element={conSuspense(conLimiteDeError(<PaginaDetallePaciente />, 'Error al cargar el paciente.'))} />
          <Route path="citas" element={conSuspense(conLimiteDeError(<PaginaCitas />, 'Error al cargar citas.'))} />
          <Route path="citas/nueva" element={conSuspense(conLimiteDeError(<PaginaNuevaCita />, 'Error al cargar el formulario de citas.'))} />
          <Route path="historial" element={conSuspense(conLimiteDeError(<PaginaHistorialCitas />, 'Error al cargar el historial.'))} />

          {/* Protección por rol */}
          <Route element={<RutaProtegida rolesPermitidos={['GERENCIA', 'ADMIN']} />}>
            <Route
              path="reportes"
              element={conSuspense(conLimiteDeError(<PaginaReportes />, 'Error al cargar reportes.'))}
            />
          </Route>

          <Route path="*" element={conSuspense(conLimiteDeError(<PaginaNotFound />, 'Error al cargar esta página.'))} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;