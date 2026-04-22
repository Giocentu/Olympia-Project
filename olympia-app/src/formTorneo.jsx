import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormTorneo = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombreTorneo: '',
        fechaInicio: '',
        fechaFin: '',
        maxEquipos: 2,
        formatoTorneo: 'Liga',
            categoriaTorneo: 'Libre',
            deporteTorneo: 'Futbol'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si el usuario cambia a "Grupos", forzamos el minimo a 4
        if (name === 'formatoTorneo' && value === 'Grupos') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                maxEquipos: Math.max(4, prevData.maxEquipos) // Sube a 4 si era menor
            }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validación de fechas
        if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
            alert("La fecha de fin no puede ser anterior a la de inicio.");
            return;
        }

        // 2. Validación preventiva del Formato
        const formato = formData.formatoTorneo.toLowerCase();
        const maxEq = parseInt(formData.maxEquipos);

        if (formato === 'grupos' && maxEq < 4) {
            alert("Para el formato 'Fase de Grupos' la capacidad máxima debe ser de al menos 4 equipos.");
            return;
        }

        if (formato === 'eliminatoria') {
            const esPotenciaDe2 = (maxEq & (maxEq - 1)) === 0;
            if (!esPotenciaDe2) {
                const confirmar = window.confirm(`Has configurado una capacidad de ${maxEq} equipos para un torneo Eliminatorio.\n\nAl no ser un número exacto para llaves perfectas (4, 8, 16, 32...), el sistema asignará "Byes" (pases directos) a algunos equipos en la primera ronda.\n\n¿Deseas crear el torneo con esta capacidad?`);
                if (!confirmar) return;
            }
        }

        const datosParaEnviar = {
            nombre_torneo: formData.nombreTorneo,
            torneo_inicio: formData.fechaInicio,
            torneo_fin: formData.fechaFin,
            max_equipos: maxEq,
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
                alert("¡Éxito! Torneo guardado correctamente.");
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

    // Calculamos el mínimo permitido dinámicamente para el input HTML
    const minEquiposPermitido = formData.formatoTorneo === 'Grupos' ? 4 : 2;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

        <button
        onClick={() => navigate(-1)}
        className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors"
        >
        &larr; <span className="ml-2 font-semibold">Volver</span>
        </button>


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
        <input
        type="number"
        name="maxEquipos"
        min={minEquiposPermitido}
        value={formData.maxEquipos}
        onChange={handleChange}
        required
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition ${formData.formatoTorneo === 'Grupos' && formData.maxEquipos < 4 ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
        />

        {/* Textos de ayuda dinámicos */}
        {formData.formatoTorneo === 'Eliminatoria' && (
            <p className="text-xs text-orange-600 mt-1 font-medium">Sugerido: 4, 8, 16 o 32 equipos.</p>
        )}
        {formData.formatoTorneo === 'Grupos' && (
            <p className="text-xs text-blue-600 mt-1 font-medium">Mínimo 4 equipos.</p>
        )}
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
