import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Save, XCircle, AlertCircle, Users, CalendarDays, Trophy, Zap, Layers, RefreshCw } from 'lucide-react';

const GestorEquipos = () => {
    const { idTorneo, nombreTorneo } = useParams();

    const [activeTab, setActiveTab] = useState('participantes');
    const [originalDisponibles, setOriginalDisponibles] = useState([]);
    const [originalAsignados, setOriginalAsignados] = useState([]);
    const [equiposDisponibles, setEquiposDisponibles] = useState([]);
    const [equiposAsignados, setEquiposAsignados] = useState([]);
    const [maxEquipos, setMaxEquipos] = useState(0);
    const [hayCambios, setHayCambios] = useState(false);

    const [partidos, setPartidos] = useState([]);
    const [formatoTorneo, setFormatoTorneo] = useState('Desconocido');
    const [generandoFixture, setGenerandoFixture] = useState(false);
    const [cargando, setCargando] = useState(true);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const respEquipos = await fetch(`http://localhost/olympia-backend/obtener_equipos_torneo.php?id_torneo=${idTorneo}`);
            const dataEquipos = await respEquipos.json();

            if (dataEquipos.status !== 'error') {
                setOriginalDisponibles(dataEquipos.disponibles);
                setOriginalAsignados(dataEquipos.asignados);
                setEquiposDisponibles(dataEquipos.disponibles);
                setEquiposAsignados(dataEquipos.asignados);
                setMaxEquipos(dataEquipos.max_equipos);
                setHayCambios(false);
            }
            cargarFixture();
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setCargando(false);
        }
    };

    const cargarFixture = async () => {
        try {
            const resp = await fetch(`http://localhost/olympia-backend/obtener_fixture.php?id_torneo=${idTorneo}`);
            const data = await resp.json();
            if (data.partidos) {
                setPartidos(data.partidos);
                setFormatoTorneo(data.formato);
            }
        } catch (error) {
            console.error("Error al cargar fixture:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [idTorneo]);

    const moverAAsignados = (equipo) => {
        if (equiposAsignados.length >= maxEquipos) return;
        setEquiposDisponibles(prev => prev.filter(e => e.id_equipo !== equipo.id_equipo));
        setEquiposAsignados(prev => [...prev, equipo]);
        setHayCambios(true);
    };

    const moverADisponibles = (equipo) => {
        setEquiposAsignados(prev => prev.filter(e => e.id_equipo !== equipo.id_equipo));
        setEquiposDisponibles(prev => [...prev, equipo]);
        setHayCambios(true);
    };

    const cancelarCambios = () => {
        setEquiposDisponibles(originalDisponibles);
        setEquiposAsignados(originalAsignados);
        setHayCambios(false);
    };

    const guardarCambiosBD = async () => {
        const idsFinales = equiposAsignados.map(e => e.id_equipo);
        try {
            const resp = await fetch("http://localhost/olympia-backend/guardar_asignaciones_batch.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_torneo: idTorneo, equipos: idsFinales })
            });
            const data = await resp.json();

            if (data.status === 'success') {
                alert("¡Ajustes guardados con éxito!");
                cargarDatos();
            } else {
                alert(data.mensaje);
            }
        } catch (error) {
            alert("Error conectando con el servidor");
        }
    };

    // --- LÓGICA DE FIXTURE ---
    const handleGenerarFixture = async () => {
        if (equiposAsignados.length < 2) {
            alert("Necesitas al menos 2 equipos para generar un fixture.");
            return;
        }

        if (hayCambios) {
            alert("Tienes cambios sin guardar en los participantes. Guárdalos primero.");
            return;
        }

        // Armamos el mensaje de advertencia dependiendo de si ya hay partidos o no
        const mensajeConfirmacion = partidos.length > 0
        ? `¡ATENCIÓN! Ya existe un cronograma. Si generas un nuevo fixture para incluir a los nuevos equipos, SE BORRARÁN los partidos actuales y todos sus resultados.\n\n¿Deseas continuar y generar un nuevo fixture de ${formatoTorneo}?`
        : `¿Generar fixture para formato ${formatoTorneo}? Esto emparejará a los equipos automáticamente.`;

        if (window.confirm(mensajeConfirmacion)) {
            setGenerandoFixture(true);
            try {
                const resp = await fetch("http://localhost/olympia-backend/generar_fixture.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_torneo: idTorneo })
                });
                const data = await resp.json();

                if (data.status === 'success') {
                    alert(data.mensaje);
                    cargarFixture();
                } else {
                    alert(data.mensaje);
                }
            } catch (error) {
                alert("Error al conectar con el servidor para generar fixture.");
            } finally {
                setGenerandoFixture(false);
            }
        }
    };

    const renderLiga = () => {
        const jornadas = partidos.reduce((acc, partido) => {
            const jornada = partido.fase_jornada || 'Jornada N/A';
            if (!acc[jornada]) acc[jornada] = [];
            acc[jornada].push(partido);
            return acc;
        }, {});

        return (
            <div className="space-y-8">
            {Object.keys(jornadas).map((jornada, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-500" />
                {jornada}
                </h4>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jornadas[jornada].map(partido => (
                    <div key={partido.id_partido} className="border border-gray-100 rounded-lg p-3 hover:border-blue-200 transition-colors bg-white">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>ID: {partido.id_partido}</span>
                    <span className={`font-semibold ${partido.estado_partido === 'Pendiente' ? 'text-orange-500' : 'text-green-600'}`}>{partido.estado_partido}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <span className="font-semibold text-gray-800 truncate" title={partido.local}>{partido.local}</span>
                    <span className="text-gray-400 font-mono">-</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <span className="font-semibold text-gray-800 truncate" title={partido.visitante}>{partido.visitante}</span>
                    <span className="text-gray-400 font-mono">-</span>
                    </div>
                    </div>
                    </div>
                ))}
                </div>
                </div>
            ))}
            </div>
        );
    };

    const renderEliminatoria = () => {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b border-gray-200">
            <h4 className="font-bold text-slate-800 text-lg">Llaves Iniciales</h4>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            {partidos.map((partido, index) => (
                <div key={partido.id_partido} className="flex flex-col justify-center relative">
                <div className="border-2 border-slate-200 rounded-lg overflow-hidden bg-white z-10 w-full sm:w-80">
                <div className="bg-slate-100 py-1 px-3 text-xs font-semibold text-slate-500 flex justify-between border-b border-slate-200">
                <span>{partido.fase_jornada || 'Fase 1'}</span>
                <span className="text-blue-600">{partido.estado_partido}</span>
                </div>
                <div className="flex flex-col">
                <div className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors flex justify-between">
                <span className="font-bold text-gray-800">{partido.local}</span>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors flex justify-between">
                <span className="font-bold text-gray-800">{partido.visitante}</span>
                </div>
                </div>
                </div>
                </div>
            ))}
            </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
        <Link to="/admin/torneos" className="text-blue-600 font-semibold hover:text-blue-800 mb-6 inline-block transition-colors">
        &larr; Volver a Torneos
        </Link>

        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <Trophy className="h-8 w-8 text-yellow-500" />
        {nombreTorneo}
        </h2>
        <div className="flex items-center gap-3 mt-2">
        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-purple-200">
        {formatoTorneo}
        </span>
        <p className="text-gray-500 text-sm">Centro de Control</p>
        </div>
        </div>
        <div className="flex gap-4">
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-600 font-semibold mb-1">Equipos Participantes</p>
        <p className="text-2xl font-bold text-blue-800">{originalAsignados.length} <span className="text-sm text-blue-500 font-normal">/ {maxEquipos}</span></p>
        </div>
        </div>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
        <button
        onClick={() => setActiveTab('participantes')}
        className={`flex items-center px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${activeTab === 'participantes' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
        <Users className="w-5 h-5 mr-2" />
        Asignar Equipos
        </button>
        <button
        onClick={() => setActiveTab('fixture')}
        className={`flex items-center px-6 py-3 font-semibold text-lg border-b-2 transition-colors ${activeTab === 'fixture' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
        <CalendarDays className="w-5 h-5 mr-2" />
        Fixture y Partidos
        </button>
        </div>

        {cargando ? (
            <div className="text-center p-10 text-gray-500">Cargando datos del torneo...</div>
        ) : (
            <>
            {activeTab === 'participantes' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Gestión de Participantes</h3>
                {hayCambios && (
                    <div className="flex items-center text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 animate-pulse">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-semibold text-sm">Tienes cambios sin guardar</span>
                    </div>
                )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-[400px]">
                <div className="bg-slate-100 p-4 border-b border-gray-200">
                <h3 className="font-bold text-slate-800">Equipos Disponibles</h3>
                </div>
                <div className="p-4 flex-grow overflow-y-auto bg-slate-50">
                {equiposDisponibles.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">No hay más equipos disponibles.</p>
                ) : (
                    <ul className="space-y-3">
                    {equiposDisponibles.map(eq => (
                        <li key={eq.id_equipo} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-100">
                        <span className="font-medium text-gray-700">{eq.nombre_equipo}</span>
                        <button
                        onClick={() => moverAAsignados(eq)}
                        disabled={equiposAsignados.length >= maxEquipos}
                        className="bg-green-100 text-green-700 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded font-bold transition-colors disabled:opacity-50 text-sm"
                        >
                        Añadir &rarr;
                        </button>
                        </li>
                    ))}
                    </ul>
                )}
                </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden flex flex-col h-[400px]">
                <div className="bg-blue-50 p-4 border-b border-blue-200">
                <h3 className="font-bold text-blue-800">Equipos en el Torneo</h3>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                {equiposAsignados.length === 0 ? (
                    <p className="text-center text-blue-300 mt-10">Aún no hay equipos asignados.</p>
                ) : (
                    <ul className="space-y-3">
                    {equiposAsignados.map(eq => (
                        <li key={eq.id_equipo} className="flex justify-between items-center bg-blue-50 p-3 rounded shadow-sm border border-blue-100">
                        <span className="font-medium text-blue-900">{eq.nombre_equipo}</span>
                        <button
                        onClick={() => moverADisponibles(eq)}
                        className="bg-red-100 text-red-600 hover:bg-red-50 hover:text-red-800 px-3 py-1.5 rounded font-bold transition-colors text-sm"
                        >
                        &larr; Quitar
                        </button>
                        </li>
                    ))}
                    </ul>
                )}
                </div>
                </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-gray-200 pt-4">
                <button onClick={cancelarCambios} disabled={!hayCambios} className="flex items-center px-6 py-2 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
                <XCircle className="w-5 h-5 mr-2" /> Cancelar
                </button>
                <button onClick={guardarCambiosBD} disabled={!hayCambios} className="flex items-center px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                <Save className="w-5 h-5 mr-2" /> Guardar
                </button>
                </div>
                </div>
            )}

            {activeTab === 'fixture' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {partidos.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <CalendarDays className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Fixture No Generado</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    El torneo no tiene partidos programados aún. El sistema detectó que el formato es <strong>{formatoTorneo}</strong>.
                    </p>
                    <button
                    onClick={handleGenerarFixture}
                    disabled={generandoFixture || originalAsignados.length < 2}
                    className="inline-flex items-center bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                    >
                    <Zap className="w-5 h-5 mr-2" />
                    {generandoFixture ? 'Generando...' : `Generar Fixture (${formatoTorneo})`}
                    </button>
                    </div>
                ) : (
                    <div>
                    <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Cronograma Oficial</h3>

                    {/* AQUI ESTA EL NUEVO BOTON PARA REGENERAR FIXTURE */}
                    <button
                    onClick={handleGenerarFixture}
                    disabled={generandoFixture}
                    className="inline-flex items-center bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm text-sm"
                    >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerar Fixture
                    </button>
                    </div>

                    {formatoTorneo.toLowerCase() === 'liga'
                        ? renderLiga()
                        : renderEliminatoria()
                    }
                    </div>
                )}
                </div>
            )}
            </>
        )}
        </div>
    );
};

export default GestorEquipos;
