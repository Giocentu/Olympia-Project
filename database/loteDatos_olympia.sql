-- -----------------------------------------------------
-- DATOS PARA LA TABLA: Rol_usuario
-- Define los permisos de quienes acceden al sistema.
-- -----------------------------------------------------
INSERT INTO Rol_usuario (id_rol, nombre_rol_usu) VALUES
(1, 'Administrador'),
(2, 'Organizador'),
(3, 'Asistente de Campo');

-- -----------------------------------------------------
-- DATOS PARA LA TABLA: Categoria
-- Define el rango o tipo de participantes.
-- -----------------------------------------------------
INSERT INTO Categoria (id_categoria, nombre_categoria) VALUES
(1, 'Libre'),
(2, 'Sub-20'),
(3, 'Senior (Mas de 40)'),
(4, 'Femenino Profesional'),
(5, 'Infantil');

-- -----------------------------------------------------
-- DATOS PARA LA TABLA: Formato
-- Define cómo se desarrolla la competencia.
-- -----------------------------------------------------
INSERT INTO Formato (id_formato, nombre_formato) VALUES
(1, 'Eliminación Directa'),
(2, 'Todos contra todos (Liga)'),
(3, 'Fase de Grupos y Eliminatoria'),
(4, 'Doble Eliminación');

-- -----------------------------------------------------
-- DATOS PARA LA TABLA: Deporte
-- Define los límites de jugadores según la disciplina.
-- -----------------------------------------------------
INSERT INTO Deporte (id_deporte, nombre_deporte, min_jugadores, max_jugadores) VALUES
(1, 'Fútbol 11', 11, 22),
(2, 'Fútbol 7', 7, 14),
(3, 'Baloncesto', 5, 12),
(4, 'Vóley', 6, 12),
(5, 'Tenis (Singles)', 1, 1);

-- -----------------------------------------------------
-- DATOS PARA LA TABLA: Estado_partido
-- Define la situación actual de un encuentro.
-- -----------------------------------------------------
INSERT INTO Estado_partido (id_estado, nombre_estado) VALUES
(1, 'Programado'),
(2, 'En Juego'),
(3, 'Finalizado'),
(4, 'Suspendido'),
(5, 'Postergado');

-- -----------------------------------------------------
-- NOTA SOBRE: rol_jugador
-- Tu script SQL actual no incluye una tabla llamada 'rol_jugador'.
-- En tu esquema, el rol se maneja con el campo 'Capitan_Nombre' en la tabla Equipo.
-- Si deseas agregarla para distinguir posiciones (ej. Portero, Delantero),
-- primero debes crear la tabla en MySQL.
-- -----------------------------------------------------
