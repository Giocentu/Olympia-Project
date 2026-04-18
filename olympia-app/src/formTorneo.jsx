import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FormTorneo = () => {
    // Estado ajustado a los campos de la tabla Torneo del nuevo DER
    const [formData, setFormData] = useState({
        nombreTorneo: '',
        fechaInicio: '',
        fechaFin: '',
        maxEquipos: 2, // Mínimo de 2 por restricción chk_max_equipos
        formatoTorneo: 'Liga',
            categoriaTorneo: 'Libre',
            deporteTorneo: 'Futbol'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validamos la lógica de fechas antes de enviar (chk_fechas_torneo)
        if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
            alert("La fecha de fin no puede ser anterior a la de inicio.");
            return;
        }

        const datosParaEnviar = {
            nombre_torneo: formData.nombreTorneo,
            torneo_inicio: formData.fechaInicio,
            torneo_fin: formData.fechaFin,
            max_equipos: parseInt(formData.maxEquipos),
            formato_torneo: formData.formatoTorneo,
                categoria_torneo: formData.categoriaTorneo,
                deporte_torneo: formData.deporteTorneo
        };

        try {
            const response = await fetch("http://localhost/olympia-backend/guardar_torneo.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosParaEnviar),
            });

            const resultado = await response.json();

            if (resultado.status === "success") {
                alert("¡Éxito! Torneo guardado en la base de datos.");
                setFormData({
                    nombreTorneo: '',
                    fechaInicio: '',
                    fechaFin: '',
                    maxEquipos: 2,
                    formatoTorneo: 'Liga',
                        categoriaTorneo: 'Libre',
                        deporteTorneo: 'Futbol'
                });
            } else {
                alert("Error: " + resultado.mensaje);
            }
        } catch (error) {
            alert("No se pudo conectar con el servidor.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        <Link to="/" className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
        <button>&larr; <span className="ml-2 font-semibold">Volver al Inicio</span></button>
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border-t-4 border-blue-500">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Registrar Nuevo Torneo</h2>
        <p className="text-gray-600 mb-8 text-center">Configura el torneo según las reglas establecidas.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Torneo</label>
        <input type="text" name="nombreTorneo" value={formData.nombreTorneo} onChange={handleChange} required placeholder="Ej. Copa Olympia" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Deporte</label>
        <select name="deporteTorneo" value={formData.deporteTorneo} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none bg-white">
        <option value="Futbol">Fútbol</option>
        <option value="Basquet">Básquet</option>
        <option value="Voley">Vóley</option>
        <option value="Ping-Pong">Ping-Pong</option>
        </select>
        </div>
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
        <select name="categoriaTorneo" value={formData.categoriaTorneo} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none bg-white">
        <option value="Sub-18">Sub-18</option>
        <option value="Libre">Libre</option>
        <option value="Veteranos">Veteranos</option>
        <option value="Junior">Junior</option>
        </select>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Formato</label>
        <select name="formatoTorneo" value={formData.formatoTorneo} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none bg-white">
        <option value="Liga">Liga</option>
        <option value="Eliminatoria">Eliminatoria</option>
        <option value="Grupos">Grupos</option>
        </select>
        </div>
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Máx. Equipos</label>
        <input type="number" name="maxEquipos" min="2" value={formData.maxEquipos} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition" />
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Inicio</label>
        <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition" />
        </div>
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Fin</label>
        <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition" />
        </div>
        </div>

        <div className="flex justify-center pt-4">
        <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
        Crear Torneo
        </button>
        </div>
        </form>
        </div>
        </div>
    );
};

export default FormTorneo;
