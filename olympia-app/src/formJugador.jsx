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
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Manejo de envío.
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos Personales del Jugador:', formData);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

            {/* --- CORRECCIÓN AQUÍ: Ahora apunta a /admin --- */}
            <Link to="/admin" className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
                <button className="flex items-center">
                    &larr; <span className="ml-2 font-semibold">Volver al Inicio</span>
                </button>
            </Link>

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl border-t-4 border-green-500">

                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Registrar Nuevo Jugador</h2>
                <p className="text-gray-600 mb-8 text-center">Ingresa los datos personales del jugador.</p>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="primerNombre" className="block text-sm font-semibold text-gray-700 mb-1">Primer Nombre</label>
                            <input type="text" name="primerNombre" id="primerNombre" value={formData.primerNombre} onChange={handleChange} required placeholder="Juan" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
                        </div>

                        <div>
                            <label htmlFor="segundoNombre" className="block text-sm font-semibold text-gray-700 mb-1">Segundo Nombre <span className="text-gray-400 font-normal">(Opcional)</span></label>
                            <input type="text" name="segundoNombre" id="segundoNombre" value={formData.segundoNombre} onChange={handleChange} placeholder="Carlos" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
                        </div>

                        <div>
                            <label htmlFor="apellido" className="block text-sm font-semibold text-gray-700 mb-1">Apellido(s)</label>
                            <input type="text" name="apellido" id="apellido" value={formData.apellido} onChange={handleChange} required placeholder="Pérez" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="dniJugador" className="block text-sm font-semibold text-gray-700 mb-1">DNI / Identificación</label>
                            <input type="text" name="dniJugador" id="dniJugador" value={formData.dniJugador} onChange={handleChange} required placeholder="Número de documento" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
                        </div>

                        <div>
                            <label htmlFor="fechaNacimiento" className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</label>
                            <input type="date" name="fechaNacimiento" id="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="correoElectronico" className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                            <input type="email" name="correoElectronico" id="correoElectronico" value={formData.correoElectronico} onChange={handleChange} required placeholder="ejemplo@correo.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
                        </div>

                        <div>
                            <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de Contacto</label>
                            <input type="tel" name="telefono" id="telefono" value={formData.telefono} onChange={handleChange} placeholder="+54 11 1234 5678" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" />
                        </div>
                    </div>

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

export default FormJugador;