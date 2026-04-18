// Importamos React y el hook useState para gestionar el estado del formulario.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


// Declaramos el componente funcional 'FormTorneo'.
const FormTorneo = () => {
    // Inicializamos el estado 'formData' con objetos vacíos para los campos de TORNEO de tu esquema.
    const [formData, setFormData] = useState({
        nombreTorneo: '', // Corresponde a 'Nombre_Torneo' VARCHAR(100)
        deporte: '', // Corresponde a 'Deporte' VARCHAR(50)
        fechaInicio: '', // Corresponde a 'Fecha_Inicio' DATE
        fechaFin: '', // Corresponde a 'Fecha_Fin' DATE
        descripcionReglas: '', // Corresponde a 'Descripcion_Reglas' TEXT
    });

    // Función para manejar los cambios en los inputs y actualizar el estado dinámicamente.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Función para manejar el envío del formulario.
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const datosParaEnviar = {
            nombre_torneo: formData.nombreTorneo,
            torneo_inicio: formData.fechaInicio,
            torneo_fin: formData.fechaFin,
            id_categoria: 1,
            id_formato: 1,
            id_deporte: 1
        };

        try {
            const response = await fetch("http://localhost/olympia-backend/guardar_torneo.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosParaEnviar),
            });

            const resultado = await response.json();

            if (resultado.status === "success") {
                alert("¡Éxito! Torneo guardado en la base de datos.");
            } else {
                alert("Error del servidor: " + resultado.mensaje);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con PHP. Revisa que Apache esté encendido en XAMPP.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

        {/* --- CAMBIO AQUÍ: Ahora apunta a "/admin" para no cerrar sesión --- */}
        <Link to="/admin" className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
            <button className="flex items-center">
                &larr; <span className="ml-2 font-semibold">Volver al Inicio</span>
            </button>
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border-t-4 border-blue-500">

            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Registrar Nuevo Torneo</h2>
            <p className="text-gray-600 mb-8 text-center">Ingresa los detalles del Torneo.</p>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <label htmlFor="nombreTorneo" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Torneo</label>
                    <input type="text" name="nombreTorneo" id="nombreTorneo" value={formData.nombreTorneo} onChange={handleChange} required placeholder="Ej. Copa Olympia Verano 2026" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="deporte" className="block text-sm font-semibold text-gray-700 mb-1">Deporte</label>
                        <select name="deporte" id="deporte" value={formData.deporte} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white">
                            <option value="" disabled>Selecciona un deporte</option>
                            <option value="Futbol">Fútbol</option>
                            <option value="Baloncesto">Baloncesto</option>
                            <option value="Tenis">Tenis</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="fechaInicio" className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Inicio</label>
                        <input type="date" name="fechaInicio" id="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition" />
                    </div>

                    <div>
                        <label htmlFor="fechaFin" className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Fin Estimada</label>
                        <input type="date" name="fechaFin" id="fechaFin" value={formData.fechaFin} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition" />
                    </div>
                </div>

                <div>
                    <label htmlFor="descripcionReglas" className="block text-sm font-semibold text-gray-700 mb-1">Reglas y Descripción</label>
                    <textarea name="descripcionReglas" id="descripcionReglas" value={formData.descripcionReglas} onChange={handleChange} rows="4" placeholder="Describe el formato, reglas principales y elegibilidad..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition h-32"></textarea>
                </div>

                <div className="flex justify-center pt-4">
                    <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300">
                        Crear y Abrir Inscripciones
                    </button>
                </div>

            </form>
        </div>
        </div>
    );
};

export default FormTorneo;