// Importamos React y el hook para manejar el estado
import React, { useState } from 'react';

const FormColaborador = () => {
  // Estado inicial siguiendo los campos de la tabla 'Usuario' de tu SQL
  const [formData, setFormData] = useState({
    dni: '', // Corresponde a dni_usuario (BIGINT)
    nombre: '', // Corresponde a nombre_usuario (VARCHAR 50)
    edad: '', // Corresponde a edad_usuario (INT)
    email: '', // Corresponde a email (VARCHAR 150)
    telefono: '', // Corresponde a telefono_usuario (BIGINT)
    rol: '3' // Por defecto 'Asistente' (id_rol 3 según el lote de datos previo)
  });

  // Función para capturar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para enviar los datos a PHP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Petición a tu nuevo script de PHP que crearemos (guardar_colaborador.php)
      const resp = await fetch("http://localhost/olympia-backend/guardar_colaborador.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const res = await resp.json();
      if(res.status === "success") alert("Colaborador registrado exitosamente");
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    // Contenedor con estilo similar a los formularios anteriores
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl border-t-4 border-orange-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrar Nuevo Personal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo DNI (Identificador único en tu DB) */}
        <div>
          <label className="block text-sm font-bold text-gray-700">DNI Usuario</label>
          <input type="number" name="dni" onChange={handleChange} required className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 outline-none" />
        </div>
        {/* Campo Nombre Completo */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Nombre Completo</label>
          <input type="text" name="nombre" onChange={handleChange} required className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 outline-none" />
        </div>
        {/* Grilla para Edad y Teléfono */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">Edad</label>
            <input type="number" name="edad" onChange={handleChange} required className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Teléfono</label>
            <input type="number" name="telefono" onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 outline-none" />
          </div>
        </div>
        {/* Campo Email (Único en tu DB) */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Correo Electrónico</label>
          <input type="email" name="email" onChange={handleChange} required className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 outline-none" />
        </div>
        {/* Selección de Rol (Basado en tu tabla Rol_usuario) */}
        <div>
          <label className="block text-sm font-bold text-gray-700">Rol de Trabajo</label>
          <select name="rol" onChange={handleChange} className="w-full p-2 border rounded bg-white outline-none">
            <option value="2">Organizador Secundario</option>
            <option value="3">Asistente de Campo</option>
          </select>
        </div>
        {/* Botón de envío */}
        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-all">Registrar en Olympia</button>
      </form>
    </div>
  );
};

export default FormColaborador;
