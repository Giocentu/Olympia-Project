import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FormEquipo = () => {
    const navigate = useNavigate();

    // 2. Agregamos el estado de 'torneos' que faltaba
    const [torneos, setTorneos] = useState([]);

    const [formData, setFormData] = useState({
        nombreEquipo: '',
        descripcionEquipo: '',
        categoriaEquipo: 'Libre',
        deporteEquipo: 'Futbol',
        torneoAsignado: ''
    });

    useEffect(() => {
        const cargarTorneos = async () => {
            try {
                const resp = await fetch("http://localhost/olympia-backend/verificar_torneos.php");
                const data = await resp.json();
                if(data.status !== 'error') {
                    setTorneos(data);
                }
            } catch (error) {
                console.error("Error cargando torneos:", error);
            }
        };
        cargarTorneos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datosEnvio = {
            nombre_equipo: formData.nombreEquipo,
            descripcion_equipo: formData.descripcionEquipo,
            categoria_equipo: formData.categoriaEquipo,
            deporte_equipo: formData.deporteEquipo,
            id_torneo: formData.torneoAsignado
        };

        try {
            const response = await fetch("http://localhost/olympia-backend/guardar_equipo.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosEnvio),
            });

            const resultado = await response.json();

            if (resultado.status === "success") {
                alert("¡Equipo registrado con éxito!");
                setFormData({
                    nombreEquipo: '',
                    descripcionEquipo: '',
                    categoriaEquipo: 'Libre',
                    deporteEquipo: 'Futbol',
                    torneoAsignado: ''
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

        <button
        onClick={() => navigate(-1)}
        className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors"
        >
        &larr; <span className="ml-2 font-semibold">Volver</span>
        </button>

        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border-t-4 border-purple-500">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Registrar Nuevo Equipo</h2>
        <p className="text-gray-600 mb-8 text-center">Registra los datos básicos del equipo.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Vincular a un Torneo (Opcional)</label>
        <select name="torneoAsignado" value={formData.torneoAsignado} onChange={handleChange} className="w-full p-2 border rounded bg-white">
        <option value="">No asignar por ahora</option>
        {torneos.map((t) => (
            <option key={t.id_torneo} value={t.id_torneo}>
            {t.nombre_torneo} ({t.deporte_torneo} - {t.categoria_torneo})
            </option>
        ))}
        </select>
        </div>

        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Equipo</label>
        <input type="text" name="nombreEquipo" value={formData.nombreEquipo} onChange={handleChange} required placeholder="Ej. Los Halcones FC" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none transition" />
        </div>

        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción corta</label>
        <input type="text" name="descripcionEquipo" value={formData.descripcionEquipo} onChange={handleChange} required placeholder="Ciudad o lema del equipo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none transition" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
        <select name="categoriaEquipo" value={formData.categoriaEquipo} onChange={handleChange} required className="w-full p-2 border rounded bg-white outline-none">
        <option value="Sub-18">Sub-18</option>
        <option value="Libre">Libre</option>
        <option value="Veteranos">Veteranos</option>
        <option value="Junior">Junior</option>
        </select>
        </div>

        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Deporte</label>
        <select name="deporteEquipo" value={formData.deporteEquipo} onChange={handleChange} required className="w-full p-2 border rounded bg-white outline-none">
        <option value="Futbol">Fútbol</option>
        <option value="Basquet">Básquet</option>
        <option value="Voley">Vóley</option>
        <option value="Ping-Pong">Ping-Pong</option>
        </select>
        </div>
        </div>

        <div className="flex justify-center pt-4">
        <button type="submit" className="w-full md:w-auto bg-purple-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-purple-700 shadow-md">
        Registrar Equipo
        </button>
        </div>
        </form>
        </div>
        </div>
    );
};

export default FormEquipo;
