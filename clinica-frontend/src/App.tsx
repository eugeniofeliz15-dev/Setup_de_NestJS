import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PaginaDashboard } from './pages/PaginaDashboard';
import { PaginaPacientes } from './pages/PaginaPacientes';
import { PaginaDetallePaciente } from './pages/PaginaDetallePaciente';
import { PaginaNuevaCita } from './pages/PaginaNuevaCita';
import { PaginaNotFound } from './pages/PaginaNotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PaginaDashboard />} />
        <Route path="pacientes" element={<PaginaPacientes />} />
        <Route path="pacientes/:id" element={<PaginaDetallePaciente />} />
        <Route path="citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;