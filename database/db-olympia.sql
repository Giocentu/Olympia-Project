CREATE DATABASE IF NOT EXISTS db_olympia;
USE db_olympia;

CREATE TABLE Rol
(
  id_rol INT NOT NULL,
  nombre_rol VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_rol),
  UNIQUE (nombre_rol)
);

CREATE TABLE Usuario
(
  dni_usuario BIGINT NOT NULL,
  nombre_usuario VARCHAR(50) NOT NULL,
  apellido_usuario VARCHAR(50) NOT NULL,
  fecha_nac DATE NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefono_usuario BIGINT,
  PRIMARY KEY (dni_usuario),
  UNIQUE (email),
  UNIQUE (telefono_usuario)
);

CREATE TABLE Usuario_rol
(
  id_rol INT NOT NULL,
  dni_usuario BIGINT NOT NULL,
  PRIMARY KEY (id_rol, dni_usuario),
  FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
  FOREIGN KEY (dni_usuario) REFERENCES Usuario(dni_usuario)
);

CREATE TABLE Torneo
(
  id_torneo INT AUTO_INCREMENT NOT NULL,
  nombre_torneo VARCHAR(150) NOT NULL,
  torneo_inicio DATE NOT NULL,
  torneo_fin DATE NOT NULL,
  max_equipos INT NOT NULL,
  formato_torneo VARCHAR(30) NOT NULL,
  categoria_torneo VARCHAR(20) NOT NULL,
  deporte_torneo VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_torneo),
  CONSTRAINT chk_fechas_torneo CHECK (torneo_fin >= torneo_inicio),
  CONSTRAINT chk_max_equipos CHECK (max_equipos >= 2),
  CONSTRAINT chk_formato_torneo CHECK (formato_torneo IN ('Liga', 'Eliminatoria', 'Fase de Grupos')),
  CONSTRAINT chk_categoria_torneo CHECK (categoria_torneo IN ('Sub-18', 'Libre', 'Veteranos', 'Junior')),
  CONSTRAINT chk_deporte_torneo CHECK (deporte_torneo IN ('Futbol', 'Basquet', 'Voley', 'Ping-Pong'))
);

CREATE TABLE Equipo
(
  id_equipo INT AUTO_INCREMENT NOT NULL,
  nombre_equipo VARCHAR(100) NOT NULL,
  descripcion_equipo VARCHAR(255),
  categoria_equipo VARCHAR(20) NOT NULL,
  deporte_equipo VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_equipo),
  CONSTRAINT chk_categoria_equipo CHECK (categoria_equipo IN ('Sub-18', 'Libre', 'Veteranos', 'Junior')),
  CONSTRAINT chk_deporte_equipo CHECK (deporte_equipo IN ('Futbol', 'Basquet', 'Voley', 'Ping-Pong')),
  UNIQUE (nombre_equipo)
);

CREATE TABLE Torneo_equipo
(
  id_torneo INT NOT NULL,
  id_equipo INT NOT NULL,
  PRIMARY KEY (id_torneo, id_equipo),
  FOREIGN KEY (id_torneo) REFERENCES Torneo(id_torneo),
  FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo)
);

CREATE TABLE List_colaboradores
(
  id_torneo INT NOT NULL,
  dni_usuario BIGINT NOT NULL,
  PRIMARY KEY (id_torneo, dni_usuario),
  FOREIGN KEY (id_torneo) REFERENCES Torneo(id_torneo),
  FOREIGN KEY (dni_usuario) REFERENCES Usuario(dni_usuario)
);

CREATE TABLE Plantilla_equipo
(
  rol_jugador VARCHAR(30) NOT NULL,
  id_equipo INT NOT NULL,
  dni_usuario BIGINT NOT NULL,
  PRIMARY KEY (id_equipo, dni_usuario),
  FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo),
  FOREIGN KEY (dni_usuario) REFERENCES Usuario(dni_usuario),
  CONSTRAINT chk_rol_jugador CHECK (rol_jugador IN ('Capitán', 'Jugador', 'Director Técnico'))
);

CREATE TABLE Partido
(
  id_partido INT AUTO_INCREMENT NOT NULL,
  marcador_local INT,
  marcador_visitante INT,
  estado_partido VARCHAR(20) NOT NULL,
  id_torneo INT NOT NULL,
  id_equipo_local INT NOT NULL,
  id_equipo_visitante INT NOT NULL,
  fase_jornada VARCHAR(50) DEFAULT 'Fase 1',
  PRIMARY KEY (id_partido),
  FOREIGN KEY (id_torneo) REFERENCES Torneo(id_torneo),
  FOREIGN KEY (id_equipo_local) REFERENCES Equipo(id_equipo),
  FOREIGN KEY (id_equipo_visitante) REFERENCES Equipo(id_equipo),
  CONSTRAINT chk_equipos_distintos CHECK (id_equipo_local != id_equipo_visitante),
  CONSTRAINT chk_marcador_local CHECK (marcador_local >= 0),
  CONSTRAINT chk_marcador_visitante CHECK (marcador_visitante >= 0),
  CONSTRAINT chk_estado_partido CHECK (estado_partido IN ('Pendiente', 'En Curso', 'Finalizado', 'Suspendido'))
);
