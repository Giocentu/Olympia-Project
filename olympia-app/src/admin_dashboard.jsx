import React from 'react';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4">
        <main className="max-w-7xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Control - Administrador</h2>

        {/* Cambiamos a grid-cols-4 para alinear las 4 opciones [cite: 270] */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Tarjeta 1: Torneo */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 flex flex-col justify-between">
        <div>
        <h3 className="text-xl font-bold text-blue-600 mb-2">1. Crear Torneo</h3>
        <p className="text-sm text-gray-600 mb-4">Configura nombre, deporte y formato de la competencia.</p>
        </div>
        <Link to="/nuevo-torneo">
        <button className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition-colors">Nuevo Torneo</button>
        </Link>
        </div>

        {/* Tarjeta 2: Jugador */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 flex flex-col justify-between">
        <div>
        <h3 className="text-xl font-bold text-green-600 mb-2">2. Registrar Jugador</h3>
        <p className="text-sm text-gray-600 mb-4">Inscribe participantes individuales en el sistema.</p>
        </div>
        <Link to="/nuevo-jugador">
        <button className="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600 transition-colors">Añadir Jugador</button>
        </Link>
        </div>

        {/* Tarjeta 3: Equipo */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500 flex flex-col justify-between">
        <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">3. Inscribir Equipo</h3>
        <p className="text-sm text-gray-600 mb-4">Crea equipos con sus integrantes y categorías.</p>
        </div>
        <Link to="/nuevo-equipo">
        <button className="w-full bg-purple-500 text-white font-bold py-2 rounded hover:bg-purple-600 transition-colors">Añadir Equipo</button>
        </Link>
        </div>

        {/* Tarjeta 4: Personal (Agregada para Gestión de Usuarios [cite: 128]) */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500 flex flex-col justify-between">
        <div>
        <h3 className="text-xl font-bold text-orange-600 mb-2">4. Gestionar Personal</h3>
        <p className="text-sm text-gray-600 mb-4">Agrega asistentes u organizadores para colaborar en el torneo.</p>
        </div>
        <Link to="/nuevo-colaborador">
        <button className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition-colors">Agregar Personal</button>
        </Link>
        </div>

        </div>
        </main>
        </div>
    );
};

export default DashboardAdmin;
