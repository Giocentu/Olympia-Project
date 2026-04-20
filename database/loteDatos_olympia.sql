-- =========================================================================
-- LOTE DE DATOS DE PRUEBA PARA OLYMPIA
-- =========================================================================

--INSERTAR ROLES BÁSICOS
INSERT INTO Rol (id_rol, nombre_rol) VALUES
(1, 'Administrador'),
(2, 'Organizador'),
(3, 'Asistente');

--INSERTAR USUARIOS (Organizadores y Capitanes)
INSERT INTO Usuario (dni_usuario, nombre_usuario, apellido_usuario, fecha_nac, email, telefono_usuario) VALUES
(11111111, 'Admin', 'Olympia', '1990-01-01', 'admin@olympia.com', 111111111),
(22222222, 'Juan', 'Pérez', '1995-05-15', 'juan@capitan.com', 222222222),
(33333333, 'Luis', 'Sosa', '1998-10-20', 'luis@capitan.com', 333333333),
(44444444, 'Carlos', 'Gómez', '1992-03-05', 'carlos@capitan.com', 444444444);

-- Asignar el rol de Admin al primer usuario
INSERT INTO Usuario_rol (id_rol, dni_usuario) VALUES (1, 11111111);

-- INSERTAR EQUIPOS

INSERT INTO Equipo (nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo)
VALUES ('Los Halcones FC', 'El mejor equipo del barrio', 'Libre', 'Futbol');
INSERT INTO Equipo (nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo)
VALUES ('Rayo Plateado', 'Rápidos y furiosos', 'Libre', 'Futbol');
INSERT INTO Equipo (nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo)
VALUES ('Centauros del Norte', 'Fuerza bruta', 'Libre', 'Futbol');
INSERT INTO Equipo (nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo)
VALUES ('Titanes de Oro', 'Los campeones invictos', 'Libre', 'Futbol');
INSERT INTO Equipo (nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo)
VALUES ('Estrella Roja', 'Pasión y gloria', 'Libre', 'Futbol');
INSERT INTO Equipo (nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo)
VALUES ('Deportivo Sur', 'Desde abajo', 'Libre', 'Futbol');
INSERT INTO Equipo (nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo)
VALUES ('Gigantes del Aro', 'Los más altos', 'Sub-18', 'Basquet');
INSERT INTO Equipo (nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo)
VALUES ('Tiradores', 'Triples seguros', 'Sub-18', 'Basquet');

-- ASIGNAR CAPITANES A LOS EQUIPOS
INSERT INTO Plantilla_equipo (rol_jugador, id_equipo, dni_usuario) VALUES
('Capitán', 1, 22222222),
('Capitán', 2, 33333333),
('Capitán', 3, 44444444),
('Capitán', 4, 22222222),
('Capitán', 5, 33333333),
('Capitán', 6, 44444444),
('Capitán', 7, 22222222),
('Capitán', 8, 33333333);


-- INSERTAR TORNEOS
INSERT INTO Torneo (nombre_torneo, torneo_inicio, torneo_fin, max_equipos, formato_torneo, categoria_torneo, deporte_torneo)
VALUES ('Liga de Verano Fútbol', DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 40 DAY), 6, 'Liga', 'Libre', 'Futbol');
INSERT INTO Torneo (nombre_torneo, torneo_inicio, torneo_fin, max_equipos, formato_torneo, categoria_torneo, deporte_torneo)
VALUES ('Copa Básquet Juvenil', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 8, 'Eliminatoria', 'Sub-18', 'Basquet');
INSERT INTO Torneo (nombre_torneo, torneo_inicio, torneo_fin, max_equipos, formato_torneo, categoria_torneo, deporte_torneo)
VALUES ('Torneo Vóley Playa', DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 4, 'Eliminatoria', 'Libre', 'Voley');


-- ASIGNAR ALGUNOS EQUIPOS (Para que el Gestor de Equipos ya tenga datos)
INSERT INTO Torneo_equipo (id_torneo, id_equipo) VALUES
(1, 1), -- Los Halcones FC
(1, 2); -- Rayo Plateado
