-- 1. Rol_usuario
INSERT INTO Rol_usuario (nombre_rol_usu) VALUES
('Administrador'),
('Organizador'),
('Asistente de Campo');

-- 2. Categoria
INSERT INTO Categoria (nombre_categoria) VALUES
('Libre'),
('Sub-20'),
('Senior (Mas de 40)'),
('Femenino Profesional'),
('Infantil');

-- 3. Formato
INSERT INTO Formato (nombre_formato) VALUES
('Eliminación Directa'),
('Todos contra todos (Liga)'),
('Fase de Grupos y Eliminatoria'),
('Doble Eliminación');

-- 4. Deporte
INSERT INTO Deporte (nombre_deporte, min_jugadores, max_jugadores) VALUES
('Fútbol 11', 11, 22),
('Fútbol 7', 7, 14),
('Baloncesto', 5, 12),
('Vóley', 6, 12),
('Tenis (Singles)', 1, 1);

-- 5. Rol_jugador
INSERT INTO Rol_jugador (nombre_rol_jug) VALUES
('Capitán'),
('Jugador'),
('Portero'),
('Suplente');

-- 6. Estado_partido
INSERT INTO Estado_partido (nombre_estado) VALUES
('Programado'),
('En Juego'),
('Finalizado'),
('Suspendido'),
('Postergado');
