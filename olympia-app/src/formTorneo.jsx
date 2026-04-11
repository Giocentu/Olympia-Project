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
        // Desestructuramos name y value del input que disparó el evento.
        const { name, value } = e.target;
        // Actualizamos formData manteniendo los valores anteriores (...prev) y sobrescribiendo el campo modificado.
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Función para manejar el envío del formulario.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // Creamos el objeto con los nombres que espera tu script PHP
        const datosParaEnviar = {
            nombre_torneo: formData.nombreTorneo,
            torneo_inicio: formData.fechaInicio,
            torneo_fin: formData.fechaFin,
            // Estos IDs son obligatorios en tu SQL, los ponemos por defecto por ahora
            id_categoria: 1,
            id_formato: 1,
            id_deporte: 1
        };

        try {
            // LLAMADA AL BACKEND: Cambia la URL si tu carpeta en htdocs se llama distinto
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

    // Retornamos el JSX que renderizará el formulario.
    return (
        // Contenedor principal con fondo gris claro, centrado y con padding.
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

        {/* Botón para volver atrás (luego se usará react-router). */}
        <Link to="/" className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
        <button>
        {/* Icono de flecha izquierda. */}
        &larr; <span className="ml-2 font-semibold">Volver al Inicio</span>
        </button>
         </Link>

        {/* Tarjeta contenedora del formulario con bordes redondeados y sombra. */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border-t-4 border-blue-500">

        {/* Título principal del formulario. */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Registrar Nuevo Torneo</h2>

        {/* Subtítulo descriptivo. */}
        <p className="text-gray-600 mb-8 text-center">Ingresa los detalles del Torneo.</p>

        {/* Formulario HTML que ejecuta handleSubmit al enviarse. */}
        <form onSubmit={handleSubmit} className="space-y-6">

        {/* Campo para el Nombre del Torneo. */}
        <div>
        {/* Etiqueta visible y accesible. */}
        <label htmlFor="nombreTorneo" className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Torneo</label>
        {/* Input de texto con estilos Tailwind (borde, padding, focus azul). */}
        <input type="text" name="nombreTorneo" id="nombreTorneo" value={formData.nombreTorneo} onChange={handleChange} required placeholder="Ej. Copa Olympia Verano 2026" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition" />
        </div>

        {/* Grilla de dos columnas para Deporte y Categoría. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Campo para el Deporte. */}
        <div>
        <label htmlFor="deporte" className="block text-sm font-semibold text-gray-700 mb-1">Deporte</label>
        {/* Select dropdown para elegir el deporte. */}
        <select name="deporte" id="deporte" value={formData.deporte} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition bg-white">
        <option value="" disabled>Selecciona un deporte</option>
        <option value="Futbol">Fútbol</option>
        <option value="Baloncesto">Baloncesto</option>
        <option value="Tenis">Tenis</option>
        </select>
        </div>

        {/* Nota: Categoría no está directamente en TORNEO, pero suele ser necesaria. La omitimos para seguir el esquema estrictamente. */}
        </div>

        {/* Grilla de dos columnas para las fechas de Inicio y Fin. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Campo Fecha de Inicio. */}
        <div>
        <label htmlFor="fechaInicio" className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Inicio</label>
        <input type="date" name="fechaInicio" id="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition" />
        </div>

        {/* Campo Fecha de Fin. */}
        <div>
        <label htmlFor="fechaFin" className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Fin Estimada</label>
        <input type="date" name="fechaFin" id="fechaFin" value={formData.fechaFin} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition" />
        </div>
        </div>

        {/* Campo para la Descripción de Reglas (TEXT en tu esquema). */}
        <div>
        <label htmlFor="descripcionReglas" className="block text-sm font-semibold text-gray-700 mb-1">Reglas y Descripción</label>
        {/* Textarea para textos largos con altura fija (h-32). */}
        <textarea name="descripcionReglas" id="descripcionReglas" value={formData.descripcionReglas} onChange={handleChange} rows="4" placeholder="Describe el formato, reglas principales y elegibilidad..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition h-32"></textarea>
        </div>

        {/* Contenedor del botón centrado. */}
        <div className="flex justify-center pt-4">
        {/* Botón de envío azul, ancho completo en móviles, hover oscuro. */}
        <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300">
        Crear y Abrir Inscripciones
        </button>
        </div>

        </form>

        </div>

        </div>

    );

};

// Exportamos el componente por defecto.
export default FormTorneo;
