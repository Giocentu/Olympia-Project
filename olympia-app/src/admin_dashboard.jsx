import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, ShieldCheck, UserPlus, Activity } from 'lucide-react';

const DashboardAdmin = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">

        {/* ENCABEZADO MEJORADO */}
        <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
        <Trophy className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Olympia Admin</h1>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
        <ShieldCheck className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-semibold text-blue-800">Organizador Principal</span>
        </div>
        </div>
        </header>

        <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 pb-12">

        {/* SECCIÓN DE ESTADÍSTICAS RÁPIDAS */}
        <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Resumen General</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-lg"><Trophy className="h-6 w-6 text-blue-600"/></div>
        <div>
        <p className="text-sm text-slate-500 font-medium">Torneos Activos</p>
        <p className="text-2xl font-bold text-slate-800">3</p>
        </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="bg-purple-100 p-3 rounded-lg"><Users className="h-6 w-6 text-purple-600"/></div>
        <div>
        <p className="text-sm text-slate-500 font-medium">Equipos Registrados</p>
        <p className="text-2xl font-bold text-slate-800">24</p>
        </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="bg-green-100 p-3 rounded-lg"><Activity className="h-6 w-6 text-green-600"/></div>
        <div>
        <p className="text-sm text-slate-500 font-medium">Partidos Hoy</p>
        <p className="text-2xl font-bold text-slate-800">5</p>
        </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="bg-orange-100 p-3 rounded-lg"><UserPlus className="h-6 w-6 text-orange-600"/></div>
        <div>
        <p className="text-sm text-slate-500 font-medium">Colaboradores</p>
        <p className="text-2xl font-bold text-slate-800">8</p>
        </div>
        </div>
        </div>
        </div>

        {/* SECCIÓN DE ACCIONES RÁPIDAS */}
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Tarjeta 1: Torneo */}
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
        <div>
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
        <Trophy className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Crear Torneo</h3>
        <p className="text-sm text-slate-500 mb-6 line-clamp-2">Configura nombre, deporte, fechas y formato de tu nueva competencia.</p>
        </div>
        <Link to="/admin/nuevo-torneo">
        <button className="w-full bg-slate-50 text-blue-600 border border-blue-200 font-bold py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-colors duration-300">
        Nuevo Torneo
        </button>
        </Link>
        </div>

        {/* Tarjeta 2: Jugador */}
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
        <div>
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors duration-300">
        <UserPlus className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Registrar Jugador</h3>
        <p className="text-sm text-slate-500 mb-6 line-clamp-2">Inscribe nuevos participantes individuales en la base de datos.</p>
        </div>
        <Link to="/admin/nuevo-jugador">
        <button className="w-full bg-slate-50 text-green-600 border border-green-200 font-bold py-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-colors duration-300">
        Añadir Jugador
        </button>
        </Link>
        </div>

        {/* Tarjeta 3: Equipo */}
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
        <div>
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors duration-300">
        <Users className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Inscribir Equipo</h3>
        <p className="text-sm text-slate-500 mb-6 line-clamp-2">Crea equipos y asígnalos a los torneos que tengas configurados.</p>
        </div>
        <Link to="/admin/nuevo-equipo">
        <button className="w-full bg-slate-50 text-purple-600 border border-purple-200 font-bold py-2.5 rounded-xl hover:bg-purple-600 hover:text-white transition-colors duration-300">
        Añadir Equipo
        </button>
        </Link>
        </div>

        {/* Tarjeta 4: Personal - ¡Actualizada con la nueva ruta! */}
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
        <div>
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors duration-300">
        <ShieldCheck className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Gestión de Personal</h3>
        <p className="text-sm text-slate-500 mb-6 line-clamp-2">Administra los roles, usuarios y el personal de tu sistema.</p>
        </div>
        <Link to="/admin/gestion-usuarios">
        <button className="w-full bg-slate-50 text-orange-600 border border-orange-200 font-bold py-2.5 rounded-xl hover:bg-orange-600 hover:text-white transition-colors duration-300">
        Ir a Gestión
        </button>
        </Link>
        </div>

        </div>
        </main>
        </div>
    );
};

export default DashboardAdmin;
