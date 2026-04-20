import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-200 text-gray-700 p-2 shadow-sm flex justify-center space-x-6 text-sm font-semibold">
        <Link to="/admin" className="hover:text-blue-600 transition-colors">Inicio</Link>
        <Link to="/admin/torneos" className="hover:text-blue-600 transition-colors">Torneos</Link>
        <Link to="/admin/nuevo-jugador" className="hover:text-blue-600 transition-colors">Participantes</Link>

        <button className="hover:text-blue-600 transition-colors cursor-not-allowed opacity-50">Calendario</button>
        <button className="hover:text-blue-600 transition-colors cursor-not-allowed opacity-50">Resultados</button>
        <button className="hover:text-blue-600 transition-colors cursor-not-allowed opacity-50">Estado</button>
        <button className="hover:text-blue-600 transition-colors cursor-not-allowed opacity-50">Estadísticas</button>

       <Link to="/admin/nuevo-personal" className="hover:text-blue-600 transition-colors">Colaboración</Link>
        </nav>
    );
};

export default Navbar;
