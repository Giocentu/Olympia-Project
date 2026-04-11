// Importamos React y useState.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Declaramos componente 'FormJugador'.
const FormJugador = () => {
    // Inicializamos estado con todos los campos personales de JUGADOR del esquema.
    const [formData, setFormData] = useState({
        primerNombre: '', // Corresponde a 'Primer_Nombre' VARCHAR(50)
    segundoNombre: '', // Corresponde a 'Segundo_Nombre' VARCHAR(50) (Opcional)
    apellido: '', // Corresponde a 'Apellido' VARCHAR(50)
    dniJugador: '', // Corresponde a 'DNI_Jugador' VARCHAR(20)
    fechaNacimiento: '', // Corresponde a 'Fecha_Nacimiento' DATE
    correoElectronico: '', // Corresponde a 'Correo_Electronico' VARCHAR(100)
    telefono: '', // Corresponde a 'Telefono' VARCHAR(20)
    });

    // Manejo de cambios en inputs.
    const handleChange = (e) => {
        // Desesctructuración.
        const { name, value } = e.target;
        // Actualización de estado.
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Manejo de envío.
    const handleSubmit = (e) => {
        // Prevenir recarga.
        e.preventDefault();
        // Consologuear datos personales.
        console.log('Datos Personales del Jugador:', formData);
        // Luego se usaría la tabla intermedia JUGADOR_EQUIPO para vincularlo (Sprint 2).
    };

    // Retornamos JSX.
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

        {/* Tarjeta contenedora con borde superior verde. */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl border-t-4 border-green-500">

        {/* Título. */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Registrar Nuevo Jugador</h2>

        {/* Subtítulo. */}
        <p className="text-gray-600 mb-8 text-center">Ingresa los datos personales del jugador.</p>

        {/* Formulario que ejecuta handleSubmit. */}
        <form onSubmit={handleSubmit} className="space-y-6">

        {/* Fila 1: Primer Nombre, Segundo Nombre y Apellido (VARCHAR(50) c/u). */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Primer Nombre. */}
        <div>
        <label htmlFor="primerNombre" className="block text-sm font-semibold text-gray-700 mb-1">Primer Nombre</label>
        <input type="text" name="primerNombre" id="primerNombre" value={formData.primerNombre} onChange={handleChange} required placeholder="Juan" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
        </div>

        {/* Segundo Nombre (Opcional según esquema). */}
        <div>
        <label htmlFor="segundoNombre" className="block text-sm font-semibold text-gray-700 mb-1">Segundo Nombre <span className="text-gray-400 font-normal">(Opcional)</span></label>
        <input type="text" name="segundoNombre" id="segundoNombre" value={formData.segundoNombre} onChange={handleChange} placeholder="Carlos" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
        </div>

        {/* Apellido. */}
        <div>
        <label htmlFor="apellido" className="block text-sm font-semibold text-gray-700 mb-1">Apellido(s)</label>
        <input type="text" name="apellido" id="apellido" value={formData.apellido} onChange={handleChange} required placeholder="Pérez" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
        </div>
        </div>

        {/* Fila 2: DNI y Fecha de Nacimiento. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* DNI_Jugador (VARCHAR(20)). */}
        <div>
        <label htmlFor="dniJugador" className="block text-sm font-semibold text-gray-700 mb-1">DNI / Identificación</label>
        <input type="text" name="dniJugador" id="dniJugador" value={formData.dniJugador} onChange={handleChange} required placeholder="Número de documento" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
        </div>

        {/* Fecha_Nacimiento (DATE). */}
        <div>
        <label htmlFor="fechaNacimiento" className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</label>
        <input type="date" name="fechaNacimiento" id="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
        </div>
        </div>

        {/* Fila 3: Correo y Teléfono. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Correo_Electronico (VARCHAR(100)). */}
        <div>
        <label htmlFor="correoElectronico" className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
        {/* Input tipo email para validación básica. */}
        <input type="email" name="correoElectronico" id="correoElectronico" value={formData.correoElectronico} onChange={handleChange} required placeholder="ejemplo@correo.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
        </div>

        {/* Telefono (VARCHAR(20)). */}
        <div>
        <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de Contacto</label>
        {/* Input tipo tel. */}
        <input type="tel" name="telefono" id="telefono" value={formData.telefono} onChange={handleChange} placeholder="+54 11 1234 5678" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
        </div>
        </div>

        {/* Botón de envío verde. */}
        <div className="flex justify-center pt-4">
        <button type="submit" className="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-green-700 transition-colors shadow-md focus:outline-none focus:ring-4 focus:ring-green-300">
        Registrar Jugador
        </button>
        </div>

        </form>

        </div>

        </div>

    );

};

// Exportamos componente.
export default FormJugador;
