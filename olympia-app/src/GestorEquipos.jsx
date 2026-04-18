import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const GestorEquipos = () => {
  const { nombreTorneo } = useParams();
  
  // Estado para guardar el fixture generado
  const [fixture, setFixture] = useState(null);

  // Datos de ejemplo extendidos para que el fixture se vea mejor
  const equiposIniciales = [
    { id: 1, nombre: "Los Halcones FC", capitan: "Juan Pérez" },
    { id: 2, nombre: "Rayo Plateado", capitan: "Luis Sosa" },
    { id: 3, nombre: "Centauros del Norte", capitan: "Marcos Paz" },
    { id: 4, nombre: "Titanes de Oro", capitan: "Ariel Gómez" },
  ];

  // FUNCIÓN MÁGICA: Generar el Fixture
  const generarFixture = () => {
    // Mezclamos los equipos de forma aleatoria
    const mezclados = [...equiposIniciales].sort(() => Math.random() - 0.5);
    
    // Los dividimos en 2 grupos (ejemplo simple)
    const grupoA = mezclados.slice(0, 2);
    const grupoB = mezclados.slice(2, 4);

    setFixture({ grupoA, grupoB });
  };

  return (
    <div className="p-6">
      <Link to="/admin/torneos" className="self-start mb-6 text-blue-600 flex items-center hover:text-blue-800 transition-colors">
        &larr; <span className="ml-2 font-semibold">Volver a Torneos</span>
      </Link>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestor de Equipos</h2>
          <p className="text-gray-600 italic">Torneo: {nombreTorneo}</p>
        </div>
        <div className="space-x-4">
          <button 
            onClick={generarFixture}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 font-bold shadow-md transition-all active:scale-95"
          >
            Generar Fixture
          </button>
          <Link to="/admin/nuevo-equipo" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-bold shadow-md transition-colors">
            + Agregar Equipo
          </Link>
        </div>
      </div>

      {/* SECCIÓN DE GRUPOS GENERADOS (Solo aparece si haces clic en el botón) */}
      {fixture && (
        <div className="mb-10 animate-fade-in-down">
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
            <span className="mr-2">📅</span> Fixture y Grupos de Clasificación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grupo A */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
              <h4 className="font-bold text-blue-800 border-b border-blue-200 mb-2">GRUPO A</h4>
              <ul className="space-y-1 text-gray-700">
                {fixture.grupoA.map(e => <li key={e.id}>• {e.nombre}</li>)}
              </ul>
            </div>
            {/* Grupo B */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm">
              <h4 className="font-bold text-green-800 border-b border-green-200 mb-2">GRUPO B</h4>
              <ul className="space-y-1 text-gray-700">
                {fixture.grupoB.map(e => <li key={e.id}>• {e.nombre}</li>)}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 italic">* Los enfrentamientos se cruzarán automáticamente según puntos.</p>
        </div>
      )}

      {/* Tabla Original de Gestión */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left text-xs uppercase font-semibold">
              <th className="px-5 py-3 border-b">Nombre del Equipo</th>
              <th className="px-5 py-3 border-b">Capitán</th>
              <th className="px-5 py-3 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {equiposIniciales.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b text-sm font-medium">{e.nombre}</td>
                <td className="px-5 py-5 border-b text-sm">{e.capitan}</td>
                <td className="px-5 py-5 border-b text-sm text-center space-x-3">
                  <button className="text-blue-600 hover:underline">Editar</button>
                  <button className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestorEquipos;