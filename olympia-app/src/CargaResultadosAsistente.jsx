import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Clock, CheckCircle2, Edit3, Save, X, LogOut, ShieldAlert, AlertTriangle } from 'lucide-react';

const CargaResultadosAsistente = () => {
    const { idTorneo } = useParams();
    const navigate = useNavigate();

    const [torneo, setTorneo] = useState(null);
    const [partidos, setPartidos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Estado de edición de marcador
    const [partidoEditando, setPartidoEditando] = useState(null);
    const [scoreLocal, setScoreLocal] = useState('');
    const [scoreVisitante, setScoreVisitante] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Cargar torneo
        const storedTorneos = localStorage.getItem('olympia_torneos_local');
        if (storedTorneos) {
            const list = JSON.parse(storedTorneos);
            const found = list.find(t => t.id_torneo === idTorneo);
            if (found) {
                setTorneo(found);
            }
        }

        // Cargar fixture/partidos
        const cargarFixture = async () => {
            let fixturePartidos = [];
            
            // 1. Intentar de localStorage
            const localPartidos = localStorage.getItem(`olympia_partidos_${idTorneo}`);
            if (localPartidos) {
                fixturePartidos = JSON.parse(localPartidos);
            } else {
                // 2. Intentar de backend
                try {
                    const resp = await fetch(`http://localhost/olympia-backend/obtener_fixture.php?id_torneo=${idTorneo}`);
                    const data = await resp.json();
                    if (data && data.partidos) {
                        fixturePartidos = data.partidos;
                        localStorage.setItem(`olympia_partidos_${idTorneo}`, JSON.stringify(fixturePartidos));
                    }
                } catch (error) {
                    console.log("Backend offline o fixture no generado.");
                }
            }

            // Si aún no hay partidos y estamos en modo demo, podemos generar unos de prueba
            if (fixturePartidos.length === 0) {
                fixturePartidos = [
                    { id_partido: 'partido_1', local: 'Dream Team FC', visitante: 'Fénix Club', marcador_local: '', marcador_visitante: '', estado_partido: 'Programado', fecha_jornada: 'Jornada 1' },
                    { id_partido: 'partido_2', local: 'Titanes Básquet', visitante: 'Golden State Basket', marcador_local: '', marcador_visitante: '', estado_partido: 'Programado', fecha_jornada: 'Jornada 1' },
                    { id_partido: 'partido_3', local: 'Dream Team FC', visitante: 'Golden State Basket', marcador_local: '3', marcador_visitante: '1', estado_partido: 'Finalizado', fecha_jornada: 'Jornada 2' }
                ];
                localStorage.setItem(`olympia_partidos_${idTorneo}`, JSON.stringify(fixturePartidos));
            }

            setPartidos(fixturePartidos);
            setCargando(false);
        };

        cargarFixture();
    }, [idTorneo]);

    const handleLogout = () => {
        localStorage.removeItem('olympia_token');
        localStorage.removeItem('olympia_role');
        localStorage.removeItem('olympia_asistente_torneo');
        navigate('/');
    };

    const iniciarEdicion = (partido) => {
        setPartidoEditando(partido);
        setScoreLocal(partido.marcador_local !== null && partido.marcador_local !== undefined ? partido.marcador_local.toString() : '');
        setScoreVisitante(partido.marcador_visitante !== null && partido.marcador_visitante !== undefined ? partido.marcador_visitante.toString() : '');
        setError('');
    };

    const cancelarEdicion = () => {
        setPartidoEditando(null);
        setScoreLocal('');
        setScoreVisitante('');
        setError('');
    };

    const guardarMarcador = (e) => {
        e.preventDefault();
        setError('');

        // Validación: enteros positivos
        const regexEntero = /^\d+$/;
        if (!regexEntero.test(scoreLocal) || !regexEntero.test(scoreVisitante)) {
            setError("Por favor, ingresa solo números enteros positivos (>= 0)");
            return;
        }

        const sl = parseInt(scoreLocal);
        const sv = parseInt(scoreVisitante);

        // Registro de cambios para auditoría de los marcadores (punto 5)
        const logsAnteriores = JSON.parse(localStorage.getItem(`olympia_logs_${idTorneo}`) || '[]');
        const asistenteNombre = localStorage.getItem('olympia_asistente_nombre') || 'Asistente Anónimo';
        
        // Obtener el valor anterior de los marcadores para dejar constancia detallada
        const scoreAnteriorLocal = partidoEditando.marcador_local !== null && partidoEditando.marcador_local !== undefined ? partidoEditando.marcador_local : 'Sin registrar';
        const scoreAnteriorVisitante = partidoEditando.marcador_visitante !== null && partidoEditando.marcador_visitante !== undefined ? partidoEditando.marcador_visitante : 'Sin registrar';
        
        const nuevoLog = {
            id_log: `log_${Date.now()}`,
            usuario: `${asistenteNombre} (Asistente)`,
            fecha: new Date().toLocaleString('es-AR'),
            partido: `${partidoEditando.local} vs ${partidoEditando.visitante}`,
            marcador_anterior: `${scoreAnteriorLocal} - ${scoreAnteriorVisitante}`,
            marcador_nuevo: `${sl} - ${sv}`,
            detalle: `Modificó marcador de ${partidoEditando.local} vs ${partidoEditando.visitante} (Antes: ${scoreAnteriorLocal}-${scoreAnteriorVisitante} | Ahora: ${sl}-${sv})`
        };
        logsAnteriores.unshift(nuevoLog); // Insertamos al inicio para ver el más reciente primero
        localStorage.setItem(`olympia_logs_${idTorneo}`, JSON.stringify(logsAnteriores));

        // Actualizar partidos en estado y localStorage
        const nuevosPartidos = partidos.map(p => {
            if (p.id_partido === partidoEditando.id_partido) {
                return {
                    ...p,
                    marcador_local: sl,
                    marcador_visitante: sv,
                    estado_partido: 'Finalizado'
                };
            }
            return p;
        });

        setPartidos(nuevosPartidos);
        localStorage.setItem(`olympia_partidos_${idTorneo}`, JSON.stringify(nuevosPartidos));
        setPartidoEditando(null);

        // Simular llamada de actualización al backend
        fetch("http://localhost/olympia-backend/guardar_marcador.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_partido: partidoEditando.id_partido,
                marcador_local: sl,
                marcador_visitante: sv,
                estado: 'Finalizado'
            })
        }).catch(err => console.log("Backend offline, resultado guardado localmente"));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Header especial sin barra de navegación global */}
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center relative z-10 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 tracking-wider">
                            OLYMPIA
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Asistente en Campo</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all border border-red-500/10"
                >
                    <LogOut className="h-4 w-4" />
                    Salir del Torneo
                </button>
            </header>

            {/* Contenido Principal */}
            <main className="flex-grow p-6 max-w-4xl mx-auto w-full space-y-6">
                
                {/* Torneo Activo */}
                <div className="bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-slate-800 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-500/5 p-6 rounded-bl-full text-indigo-500/10 pointer-events-none">
                        <ShieldAlert className="h-16 w-16" />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-extrabold px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wider">
                            Torneo Conectado
                        </span>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-2.5">
                            {torneo ? torneo.nombre_torneo : 'Superliga de Fútbol Amateur'}
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Ingresa los marcadores oficiales de los encuentros disputados. La tabla de clasificación se recalculará de forma inmediata.
                        </p>
                    </div>
                </div>

                {/* Mensaje de Error en Edición */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Fixture de Partidos */}
                <div className="space-y-4">
                    <h2 className="text-lg font-black text-white tracking-wide uppercase px-2">
                        Cronograma de Encuentros
                    </h2>

                    {cargando ? (
                        <div className="text-center py-12 text-slate-500 text-sm font-bold">
                            Cargando fixture...
                        </div>
                    ) : partidos.length === 0 ? (
                        <div className="bg-slate-900/30 border border-slate-850 p-12 rounded-3xl text-center text-slate-500 text-sm">
                            No se han programado partidos para este torneo aún.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {partidos.map((partido) => {
                                const esEditando = partidoEditando && partidoEditando.id_partido === partido.id_partido;
                                const finalizado = partido.estado_partido === 'Finalizado';

                                return (
                                    <div
                                        key={partido.id_partido}
                                        className={`bg-slate-900 border rounded-3xl p-5 transition-all relative overflow-hidden ${
                                            esEditando 
                                            ? 'border-indigo-500 shadow-lg shadow-indigo-600/5' 
                                            : finalizado
                                            ? 'border-slate-850 opacity-90'
                                            : 'border-slate-800 hover:border-slate-700'
                                        }`}
                                    >
                                        {/* Cabecera Tarjeta Partido */}
                                        <div className="flex justify-between items-center text-[10px] text-slate-500 mb-3 font-semibold uppercase tracking-wider">
                                            <span>{partido.fecha_jornada || 'Jornada Única'}</span>
                                            <span className={`px-2 py-0.5 rounded-md font-bold ${
                                                finalizado 
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/10' 
                                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/10'
                                            }`}>
                                                {partido.estado_partido}
                                            </span>
                                        </div>

                                        {/* Detalle y Marcadores */}
                                        {esEditando ? (
                                            /* Formulario de Carga */
                                            <form onSubmit={guardarMarcador} className="space-y-4">
                                                <div className="flex justify-center items-center gap-6 py-2">
                                                    {/* Equipo Local */}
                                                    <div className="flex flex-col items-center flex-1 text-center">
                                                        <span className="font-extrabold text-sm text-slate-100 max-w-[150px] truncate">
                                                            {partido.local}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Local</span>
                                                    </div>

                                                    {/* Inputs de marcador */}
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="number"
                                                            value={scoreLocal}
                                                            onChange={(e) => setScoreLocal(e.target.value)}
                                                            className="w-16 h-12 text-center bg-slate-950 border border-indigo-500/40 rounded-xl font-mono text-xl font-black text-white focus:border-indigo-500 outline-none"
                                                            min={0}
                                                            required
                                                            autoFocus
                                                        />
                                                        <span className="text-slate-600 font-black text-sm">-</span>
                                                        <input
                                                            type="number"
                                                            value={scoreVisitante}
                                                            onChange={(e) => setScoreVisitante(e.target.value)}
                                                            className="w-16 h-12 text-center bg-slate-950 border border-indigo-500/40 rounded-xl font-mono text-xl font-black text-white focus:border-indigo-500 outline-none"
                                                            min={0}
                                                            required
                                                        />
                                                    </div>

                                                    {/* Equipo Visitante */}
                                                    <div className="flex flex-col items-center flex-1 text-center">
                                                        <span className="font-extrabold text-sm text-slate-100 max-w-[150px] truncate">
                                                            {partido.visitante}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Visitante</span>
                                                    </div>
                                                </div>

                                                {/* Acciones de Edición */}
                                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                                                    <button
                                                        type="button"
                                                        onClick={cancelarEdicion}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-400 rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10 transition-colors"
                                                    >
                                                        <Save className="h-3.5 w-3.5" />
                                                        Guardar Marcador
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            /* Mostrar Marcador: Diseño flexible y responsivo para evitar superposiciones (punto 4) */
                                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
                                                {/* Contenedor principal de equipos y marcadores */}
                                                <div className="flex items-center justify-between flex-grow w-full sm:w-auto gap-4">
                                                    {/* Equipo Local */}
                                                    <span className="font-extrabold text-sm text-slate-100 flex-1 truncate" title={partido.local}>
                                                        {partido.local}
                                                    </span>

                                                    {/* Marcador en el centro */}
                                                    <div className="flex items-center justify-center min-w-[90px]">
                                                        {finalizado ? (
                                                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/80 rounded-xl border border-slate-850 font-mono font-black text-sm text-indigo-300">
                                                                <span>{partido.marcador_local}</span>
                                                                <span className="text-slate-700 text-xs">-</span>
                                                                <span>{partido.marcador_visitante}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-[10px] text-slate-500 font-bold tracking-wider bg-slate-950/40 border border-slate-850 px-3 py-1 rounded-xl uppercase">
                                                                VS
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Equipo Visitante */}
                                                    <span className="font-extrabold text-sm text-slate-100 flex-1 text-right truncate" title={partido.visitante}>
                                                        {partido.visitante}
                                                    </span>
                                                </div>

                                                {/* Botón de Edición Rápida posicionado en el flujo normal (sin absolute) */}
                                                <div className="flex-shrink-0 w-full sm:w-auto flex justify-end">
                                                    <button
                                                        onClick={() => iniciarEdicion(partido)}
                                                        className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-indigo-400 hover:text-indigo-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 sm:px-2 text-xs font-bold"
                                                        title={finalizado ? "Corregir Marcador" : "Registrar Marcador"}
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                        <span className="sm:hidden">{finalizado ? "Corregir Marcador" : "Registrar Marcador"}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CargaResultadosAsistente;
