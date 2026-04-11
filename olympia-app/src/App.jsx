import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Navbar';
import DashboardAdmin from './admin_dashboard';
import FormTorneo from './formTorneo';
import FormEquipo from './formEquipo';
import FormJugador from './formJugador';
import FormColaborador from './formColaborador';

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
    <Route path="/" element={<DashboardAdmin />} />
    <Route path="/nuevo-torneo" element={<FormTorneo />} />
    <Route path="/nuevo-equipo" element={<FormEquipo />} />
    <Route path="/nuevo-jugador" element={<FormJugador />} />
    <Route path="/nuevo-colaborador" element={<FormColaborador />} />
    </Routes>
    </div>
    </div>
    </Router>
  );
}
export default App;
