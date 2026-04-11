// Importamos React y el hook useState.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Declaramos el componente funcional 'FormEquipo'.
const FormEquipo = () => {
    // Inicializamos el estado 'formData' con campos de EQUIPO del esquema.
    const [formData, setFormData] = useState({
        nombreEquipo: '', // Corresponde a 'Nombre_Equipo' VARCHAR(100)
    capitanNombre: '', // Corresponde a 'Capitan_Nombre' VARCHAR(100)
    entrenador: '', // Corresponde a 'Entrenador' VARCHAR(100)
    torneoAsignado: '', // Necesario para la FK ID_Torneo
    });

    // Función para manejar cambios en inputs.
    const handleChange = (e) => {
        // Desestructuramos name y value.
        const { name, value } = e.target;
        // Actualizamos estado dinámicamente.
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Función para manejar el envío del formulario.
    const handleSubmit = (e) => {
        // Prevenimos recarga de página.
        e.preventDefault();
        // Consologueamos los datos.
        console.log('Datos del Equipo a inscribir:', formData);
        // Aquí se vincularía el ID_Torneo seleccionado.
    };

    // Retornamos el JSX del formulario.
    return (
        // Contenedor principal flex centrado.
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

        {/* Botón volver atrás. */}
        <Link to="/" className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
        <button>
        {/* Icono de flecha izquierda. */}
        &larr; <span className="ml-2 font-semibold">Volver al Inicio</span>
        </button>
        </Link>

        {/* Tarjeta contenedora con borde superior púrpura. */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border-t-4 border-purple-500">

        {/* Título del formulario. */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Registrar Nuevo Equipo</h2>

        {/* Subtítulo. */}
        <p className="text-gray-600 mb-8 text-center">Ingresa los datos del equipo. Los jugadores se añadirán después.</p>

        {/* Formulario que ejecuta handleSubmit. */}
        <form onSubmit={handleSubmit} className="space-y-6">

        {/* Selección del Torneo (para la FK ID_Torneo). */}
        <div>
        <label htmlFor="torneoAsignado" className="block text-sm font-semibold text-gray-700 mb-1">Torneo a Inscribirse</label>
        <select name="torneoAsignado" id="torneoAsignado" value={formData.torneoAsignado} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition bg-white">
        <option value="" disabled>Selecciona un torneo activo</option>
        {/* Estos valores vendrían de la base de datos (TABLA TORNEO). */}
        <option value="1">Copa Olympia Verano 2026 (Fútbol)</option>
        <option value="2">Liga Local Baloncesto</option>
        </select>
        </div>

        {/* Campo Nombre del Equipo. */}
        <div>
        <label htmlFor="nombreEquipo" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Equipo</label>
        <input type="text" name="nombreEquipo" id="nombreEquipo" value={formData.nombreEquipo} onChange={handleChange} required placeholder="Ej. Los Halcones FC" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition" />
        </div>

        {/* Grilla dos columnas para Capitán y Entrenador. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Campo Nombre del Capitán. */}
        <div>
        <label htmlFor="capitanNombre" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Capitán</label>
        <input type="text" name="capitanNombre" id="capitanNombre" value={formData.capitanNombre} onChange={handleChange} placeholder="Nombre completo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition" />
        </div>

        {/* Campo Nombre del Entrenador. */}
        <div>
        <label htmlFor="entrenador" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Entrenador</label>
        <input type="text" name="entrenador" id="entrenador" value={formData.entrenador} onChange={handleChange} placeholder="Nombre completo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition" />
        </div>
        </div>

        {/* Botón de envío púrpura. */}
        <div className="flex justify-center pt-4">
        <button type="submit" className="w-full md:w-auto bg-purple-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-purple-700 transition-colors shadow-md focus:outline-none focus:ring-4 focus:ring-purple-300">
        Registrar Equipo
        </button>
        </div>

        </form>

        </div>

        </div>

    );

};

// Exportamos componente.
export default FormEquipo;
