import React from 'react';
import { Link } from 'react-router-dom';

const ListaTorneos = () => {
    // Datos de ejemplo (luego los traeremos de la base de datos con fetch)
    const torneos = [
        { id: 1, nombre: "Copa Olympia Verano 2026", deporte: "Fútbol", estado: "Abierto" },
    ];

    return (
        <div className="p-6">
            
            {/* Botón para volver al Dashboard principal */}
            <Link to="/admin" className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
                <button className="flex items-center">
                    &larr; <span className="ml-2 font-semibold">Volver al Inicio</span>
                </button>
            </Link>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Torneos</h2>
                <Link to="/admin/nuevo-torneo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Nuevo Torneo
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-left text-xs uppercase font-semibold">
                            <th className="px-5 py-3 border-b">Nombre</th>
                            <th className="px-5 py-3 border-b">Deporte</th>
                            <th className="px-5 py-3 border-b">Estado</th>
                            <th className="px-5 py-3 border-b text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {torneos.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-5 py-5 border-b text-sm">{t.nombre}</td>
                                <td className="px-5 py-5 border-b text-sm">{t.deporte}</td>
                                <td className="px-5 py-5 border-b text-sm">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                        {t.estado}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b text-sm text-center space-x-2">
                                    <button className="text-blue-600 hover:text-blue-900 font-semibold">Editar</button>
                                    
                                    {/* --- AQUÍ ESTÁ EL CAMBIO CLAVE --- */}
                                    <Link 
                                        to={`/admin/gestor-equipos/${encodeURIComponent(t.nombre)}`} 
                                        className="text-purple-600 hover:text-purple-900 font-semibold"
                                    >
                                        Equipos
                                    </Link>
                                    
                                    <button className="text-red-600 hover:text-red-900 font-semibold">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaTorneos;