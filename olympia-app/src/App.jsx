import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardAdmin from './admin_dashboard';
import FormTorneo from './formTorneo';
import FormEquipo from './formEquipo';
import FormJugador from './formJugador';
import FormColaborador from './formColaborador';
import LoginPage from './LoginPage'; 
import ListaTorneos from './ListaTorneos';
import GestorEquipos from './GestorEquipos'; 

import './index.css';

const HeaderConCerrarSesion = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/'); 
  };

  return (
    <header className="bg-blue-500 text-white p-4 shadow-md flex justify-between items-center">
      <div className="w-24"></div> 
      <h1 className="text-3xl font-bold">Olympia</h1>
      <button 
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        Cerrar Sesión
      </button>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* 1. RUTA DE ACCESO (LOGIN) */}
          <Route path="/" element={<LoginPage />} />

          {/* 2. RUTAS ADMINISTRATIVAS */}
          <Route
            path="/admin/*"
            element={
              <>
                <HeaderConCerrarSesion />
                <Navbar />
                <div className="p-4">
                  <Routes>
                    {/* Inicio del Panel */}
                    <Route path="/" element={<DashboardAdmin />} />
                    
                    {/* Gestión de Torneos */}
                    <Route path="/torneos" element={<ListaTorneos />} />

                    {/* RUTA DINÁMICA: Gestor de Equipos (Debe ir antes del asterisco) */}
                    <Route path="/gestor-equipos/:nombreTorneo" element={<GestorEquipos />} />

                    {/* Formularios de creación */}
                    <Route path="/nuevo-torneo" element={<FormTorneo />} />
                    <Route path="/nuevo-equipo" element={<FormEquipo />} />
                    <Route path="/nuevo-jugador" element={<FormJugador />} />
                    <Route path="/nuevo-colaborador" element={<FormColaborador />} />
                    
                    {/* REDIRECCIÓN DE SEGURIDAD: Siempre al final */}
                    <Route path="*" element={<Navigate to="/admin" />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;