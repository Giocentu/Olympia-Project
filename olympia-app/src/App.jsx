import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Navbar';
import DashboardAdmin from './admin_dashboard';
import FormTorneo from './formTorneo';
import FormEquipo from './formEquipo';
import FormJugador from './formJugador';
import FormColaborador from './formColaborador';
import DashboardUsuarios from './DashboardUsuarios'; // Importamos el nuevo Dashboard de usuarios

import './index.css';

function App() {
  return (
    <Router>
    <div className="min-h-screen bg-gray-100">
    {/* Encabezado fijo de Olympia basado en prototipos  */}
    <header className="bg-blue-500 text-white p-4 shadow-md">
    <h1 className="text-3xl font-bold text-center">Olympia</h1>
    </header>

    {/* Renderizamos el componente Navbar que antes no aparecía */}
    <Navbar />

    <div className="p-4">
    <Routes>
    {/* Ruta base que muestra el dashboard de administrador */}
    <Route path="/" element={<DashboardAdmin />} />

    {/* Agregamos esta ruta para que el botón de "Volver" en Gestión de Usuarios funcione correctamente */}
    <Route path="/admin-dashboard" element={<DashboardAdmin />} />

    {/* Rutas de los formularios */}
    <Route path="/nuevo-torneo" element={<FormTorneo />} />
    <Route path="/nuevo-equipo" element={<FormEquipo />} />
    <Route path="/nuevo-jugador" element={<FormJugador />} />
    <Route path="/nuevo-colaborador" element={<FormColaborador />} />

    {/* Nueva ruta para el Dashboard de Gestión de Personal/Usuarios */}
    <Route path="/gestion-usuarios" element={<DashboardUsuarios />} />
    </Routes>
    </div>
    </div>
    </Router>
  );
}

export default App;
