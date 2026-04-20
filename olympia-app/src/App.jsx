import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './Navbar';
import DashboardAdmin from './admin_dashboard';
import FormTorneo from './formTorneo';
import FormEquipo from './formEquipo';
import FormJugador from './formJugador';
import FormPersonal from './FormPersonal';
import LoginPage from './LoginPage';
import ListaTorneos from './ListaTorneos';
import GestorEquipos from './GestorEquipos';
import DashboardUsuarios from './DashboardUsuarios';
import ProtectedRoute from './ProtectedRoute';

import './index.css';

const HeaderConCerrarSesion = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('olympia_token');
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
    <div className="w-32"></div>
    <div className="flex items-center gap-3">
    <h1 className="text-3xl font-bold tracking-wide">Olympia</h1>
    </div>
    <div className="w-32 flex justify-end">
    <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
    >
    Cerrar Sesión
    </button>
    </div>
    </header>
  );
};

function App() {
  return (
    <Router>
    <div className="min-h-screen bg-gray-50">
    <Routes>
    <Route path="/" element={<LoginPage />} />

    <Route element={<ProtectedRoute />}>
    <Route
    path="/admin/*"
    element={
      <>
      <HeaderConCerrarSesion />
      <Navbar />

      <div className="p-4 max-w-7xl mx-auto">
      <Routes>
      <Route path="/" element={<DashboardAdmin />} />
      <Route path="/torneos" element={<ListaTorneos />} />


      <Route path="/gestor-equipos/:idTorneo/:nombreTorneo" element={<GestorEquipos />} />

      <Route path="/nuevo-torneo" element={<FormTorneo />} />
      <Route path="/nuevo-equipo" element={<FormEquipo />} />
      <Route path="/nuevo-jugador" element={<FormJugador />} />
      <Route path="/nuevo-personal" element={<FormPersonal />} />
      <Route path="/gestion-usuarios" element={<DashboardUsuarios />} />
      <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
      </div>
      </>
    }
    />
    </Route>

    <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </div>
    </Router>
  );
}

export default App;
