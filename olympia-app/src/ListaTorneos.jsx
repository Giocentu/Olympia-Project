import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListaTorneos = () => {
    const [torneos, setTorneos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarTorneos = async () => {
            try {
                const resp = await fetch("http://localhost/olympia-backend/obtener_torneos.php");
                const data = await resp.json();
                if (Array.isArray(data)) setTorneos(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarTorneos();
    }, []);

    const obtenerColorEstado = (estado) => {
        switch (estado) {
            case 'Activo': return 'bg-green-100 text-green-800 border-green-200';
            case 'Programado': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Finalizado': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="p-6">
        <Link to="/admin" className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
        <button className="flex items-center">&larr; <span className="ml-2 font-semibold">Volver al Inicio</span></button>
        </Link>

        <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Torneos</h2>
        <Link to="/admin/nuevo-torneo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm">
        + Nuevo Torneo
        </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
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
        {cargando ? (
            <tr><td colSpan="4" className="px-5 py-8 text-center text-gray-500">Cargando...</td></tr>
        ) : torneos.length === 0 ? (
            <tr><td colSpan="4" className="px-5 py-8 text-center text-gray-500">No hay torneos.</td></tr>
        ) : (
            torneos.map((t) => (
                <tr key={t.id_torneo} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-5 border-b text-sm font-medium text-gray-800">{t.nombre_torneo}</td>
                <td className="px-5 py-5 border-b text-sm text-gray-600">{t.deporte_torneo}</td>
                <td className="px-5 py-5 border-b text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${obtenerColorEstado(t.estado)}`}>
                {t.estado}
                </span>
                </td>
                <td className="px-5 py-5 border-b text-sm text-center space-x-4">
                <button className="text-blue-600 hover:text-blue-900 font-semibold">Editar</button>

                {/* AQUI ESTÁ EL CAMBIO: Pasamos t.id_torneo a la URL */}
                <Link
                to={`/admin/gestor-equipos/${t.id_torneo}/${encodeURIComponent(t.nombre_torneo)}`}
                className="text-purple-600 hover:text-purple-900 font-semibold"
                >
                Equipos
                </Link>

                <button className="text-red-600 hover:text-red-900 font-semibold">Eliminar</button>
                </td>
                </tr>
            ))
        )}
        </tbody>
        </table>
        </div>
        </div>
    );
};

export default ListaTorneos;
