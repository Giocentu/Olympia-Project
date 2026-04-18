import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Search, ShieldAlert } from 'lucide-react';

const DashboardUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    // Estado para el pequeño formulario de asignar rol
    const [asignarData, setAsignarData] = useState({
        dni: '',
        rol: '2' // Suponiendo: 1=Admin, 2=Organizador, 3=Asistente
    });

    // Cargar usuarios al entrar a la pantalla
    const cargarUsuarios = async () => {
        try {
            const resp = await fetch("http://localhost/olympia-backend/obtener_usuarios_roles.php");
            const data = await resp.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const handleAsignarCambio = (e) => {
        setAsignarData({ ...asignarData, [e.target.name]: e.target.value });
    };

    // Enviar el DNI para asignar un rol
    const handleAsignarRol = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch("http://localhost/olympia-backend/guardar_colaborador.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(asignarData)
            });
            const resultado = await resp.json();

            if (resultado.status === "success") {
                alert(resultado.mensaje);
                setAsignarData({ dni: '', rol: '2' }); // Limpiar input
                cargarUsuarios(); // Recargar la tabla para mostrar el nuevo rol
            } else {
                alert(resultado.mensaje); // Mostrará el error si el DNI no existe
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
        }
    };

    // Filtrar usuarios para la barra de búsqueda
    const usuariosFiltrados = usuarios.filter(u =>
    u.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.dni_usuario.toString().includes(busqueda)
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6">
        {/* Aquí modificamos el enlace para volver al panel de administrador */}
        <Link to="/admin-dashboard" className="text-blue-600 font-semibold hover:text-blue-800 mb-6 inline-block">
        &larr; Volver al Panel de Administrador
        </Link>

        <div className="max-w-7xl mx-auto">
        {/* Cabecera y Botón Nuevo Usuario */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center space-x-3">
        <div className="bg-orange-100 p-3 rounded-lg"><Users className="h-8 w-8 text-orange-600"/></div>
        <div>
        <h1 className="text-3xl font-bold text-slate-800">Gestión de Personal y Usuarios</h1>
        <p className="text-slate-500">Administra los roles y participantes del sistema.</p>
        </div>
        </div>
        {/* Al darle clic, te lleva al formulario de jugador (que ahora es crear usuario base) */}
        <Link to="/nuevo-jugador">
        <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md">
        <UserPlus className="h-5 w-5" />
        <span>Registrar Nuevo Usuario</span>
        </button>
        </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Módulo de Asignación Rápida de Rol */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-1 h-fit">
        <div className="flex items-center space-x-2 mb-4">
        <ShieldAlert className="text-orange-500 h-6 w-6" />
        <h2 className="text-xl font-bold text-slate-800">Asignar Rol (Colaborador)</h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">Ingresa el DNI de un usuario ya registrado en el sistema para darle permisos de administrador o asistente.</p>

        <form onSubmit={handleAsignarRol} className="space-y-4">
        <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">DNI del Usuario</label>
        <input type="number" name="dni" value={asignarData.dni} onChange={handleAsignarCambio} required placeholder="Ej. 12345678" className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-200" />
        </div>
        <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Seleccionar Rol</label>
        <select name="rol" value={asignarData.rol} onChange={handleAsignarCambio} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 bg-white">
        <option value="1">Administrador</option>
        <option value="2">Organizador Secundario</option>
        <option value="3">Asistente de Campo</option>
        </select>
        </div>
        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 transition shadow-sm">
        Asignar Rol
        </button>
        </form>
        </div>

        {/* Tabla de Usuarios Registrados */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 lg:col-span-2 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Base de Datos de Usuarios</h2>
        <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        <input
        type="text"
        placeholder="Buscar por DNI o Nombre..."
        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        />
        </div>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
        <thead>
        <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
        <th className="px-6 py-3 font-semibold">DNI</th>
        <th className="px-6 py-3 font-semibold">Usuario (Nombre y Apellido)</th>
        <th className="px-6 py-3 font-semibold">Roles Asignados</th>
        <th className="px-6 py-3 font-semibold text-center">Acción</th>
        </tr>
        </thead>
        <tbody>
        {usuariosFiltrados.length > 0 ? (
            usuariosFiltrados.map((u) => (
                <tr key={u.dni_usuario} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-700">{u.dni_usuario}</td>
                <td className="px-6 py-4">
                <div className="font-semibold text-slate-800">{u.nombre_usuario} {u.apellido_usuario}</div>
                <div className="text-xs text-slate-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                {u.roles_asignados}
                </span>
                </td>
                <td className="px-6 py-4 text-center">
                {/* Botón visual para futura implementación (Ver detalles) */}
                <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Ver Detalles</button>
                </td>
                </tr>
            ))
        ) : (
            <tr>
            <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
            No se encontraron usuarios en el sistema.
            </td>
            </tr>
        )}
        </tbody>
        </table>
        </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default DashboardUsuarios;
