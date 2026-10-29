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

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

      {/* 1. Protección general: Requiere estar autenticado */}
      <Route element={<RutaProtegida />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<PaginaDashboard />} />
          <Route path="pacientes" element={<PaginaPacientes />} />
          <Route path="pacientes/nuevo" element={<PaginaCrearPaciente />} />
          <Route path="pacientes/:id" element={<PaginaDetallePaciente />} />
          <Route path="citas" element={<PaginaCitas />} />
          <Route path="citas/nueva" element={<PaginaNuevaCita />} />
          
          {/* 2. Protección por rol: Requiere estar autenticado Y tener el rol específico */}
          <Route element={<RutaProtegida rolesPermitidos={['GERENCIA', 'ADMIN']} />}>
            <Route path="reportes" element={<PaginaReportes />} />
          </Route>
          
          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;