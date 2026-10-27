import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PaginaDashboard } from './pages/PaginaDashboard';
import { PaginaPacientes } from './pages/PaginaPacientes';
import { PaginaCrearPaciente } from './pages/PaginaCrearPaciente';
import { PaginaDetallePaciente } from './pages/PaginaDetallePaciente';
import { PaginaCitas } from './pages/PaginaCitas';
import { PaginaNuevaCita } from './pages/PaginaNuevaCita';
import { PaginaLogin } from './pages/PaginaLogin';
import { PaginaNotFound } from './pages/PaginaNotFound';
import { PaginaReportes } from './pages/PaginaReportes';

function App() {
  return (
    <Routes>
      {/* Ruta pública: Login */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* Rutas protegidas (con Layout y autenticación) */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<PaginaDashboard />} />
        <Route path="pacientes" element={<PaginaPacientes />} />
        <Route path="pacientes/nuevo" element={<PaginaCrearPaciente />} />
        <Route path="pacientes/:id" element={<PaginaDetallePaciente />} />
        <Route path="citas" element={<PaginaCitas />} />
        <Route path="citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="reportes" element={<PaginaReportes />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;