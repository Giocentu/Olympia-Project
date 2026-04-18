import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FormEquipo = () => {
    const [formData, setFormData] = useState({
        torneoId: '',
        nombreEquipo: '',
        nombreCapitan: '',
        nombreEntrenador: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del Equipo:', formData);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

            {/* --- CORRECCIÓN AQUÍ: Ahora apunta a /admin para no cerrar sesión --- */}
            <Link to="/admin" className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
                <button className="flex items-center">
                    &larr; <span className="ml-2 font-semibold">Volver al Inicio</span>
                </button>
            </Link>

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border-t-4 border-purple-500">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Registrar Nuevo Equipo</h2>
                <p className="text-gray-600 mb-8 text-center">Ingresa los datos del equipo. Los jugadores se añadirán después.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="torneoId" className="block text-sm font-semibold text-gray-700 mb-1">Torneo a Inscribirse</label>
                        <select name="torneoId" id="torneoId" value={formData.torneoId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition bg-white">
                            <option value="">Selecciona un torneo activo</option>
                            <option value="1">Copa Olympia Verano 2026</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="nombreEquipo" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Equipo</label>
                        <input type="text" name="nombreEquipo" id="nombreEquipo" value={formData.nombreEquipo} onChange={handleChange} required placeholder="Ej. Los Halcones FC" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nombreCapitan" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Capitán</label>
                            <input type="text" name="nombreCapitan" id="nombreCapitan" value={formData.nombreCapitan} onChange={handleChange} required placeholder="Nombre completo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition" />
                        </div>

                        <div>
                            <label htmlFor="nombreEntrenador" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Entrenador</label>
                            <input type="text" name="nombreEntrenador" id="nombreEntrenador" value={formData.nombreEntrenador} onChange={handleChange} required placeholder="Nombre completo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition" />
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <button type="submit" className="w-full md:w-auto bg-purple-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                            Registrar Equipo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormEquipo;