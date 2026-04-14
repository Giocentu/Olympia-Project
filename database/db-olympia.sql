CREATE DATABASE IF NOT EXISTS db_olympia;
USE db_olympia;


CREATE TABLE Rol_usuario (
  id_rol INT AUTO_INCREMENT NOT NULL,
  nombre_rol_usu VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_rol)
);

CREATE TABLE Categoria (
  id_categoria INT AUTO_INCREMENT NOT NULL,
  nombre_categoria VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_categoria)
);

CREATE TABLE Formato (
  id_formato INT AUTO_INCREMENT NOT NULL,
  nombre_formato VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_formato)
);

CREATE TABLE Deporte (
  id_deporte INT AUTO_INCREMENT NOT NULL,
  nombre_deporte VARCHAR(50) NOT NULL,
  min_jugadores INT NOT NULL,
  max_jugadores INT NOT NULL,
  PRIMARY KEY (id_deporte),
  CONSTRAINT ck_rango_jugadores CHECK (min_jugadores > 0 AND max_jugadores >= min_jugadores)
);

CREATE TABLE Rol_jugador (
  id_rol_jugador INT AUTO_INCREMENT NOT NULL,
  nombre_rol_jug VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_rol_jugador)
);

CREATE TABLE Estado_partido (
  id_estado INT AUTO_INCREMENT NOT NULL,
  nombre_estado VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_estado)
);


CREATE TABLE Usuario (
  dni_usuario BIGINT NOT NULL,
  nombre_usuario VARCHAR(50) NOT NULL,
  edad_usuario INT NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefono_usuario BIGINT,
  id_rol INT NOT NULL,
  PRIMARY KEY (dni_usuario),
  FOREIGN KEY (id_rol) REFERENCES Rol_usuario(id_rol),
  UNIQUE (email),
  UNIQUE (telefono_usuario),
  CONSTRAINT ck_edad_usuario CHECK (edad_usuario > 0 AND edad_usuario < 120)
);

CREATE TABLE Jugador (
  dni_jugador BIGINT NOT NULL,
  nombre_jugador VARCHAR(70) NOT NULL,
  apellido_jugador VARCHAR(70) NOT NULL,
  edad_jugador INT NOT NULL,
  telefono_jugador BIGINT,
  id_rol_jugador INT NOT NULL,
  PRIMARY KEY (dni_jugador),
  FOREIGN KEY (id_rol_jugador) REFERENCES Rol_jugador(id_rol_jugador),
  UNIQUE (telefono_jugador),
  CONSTRAINT ck_edad_jugador CHECK (edad_jugador > 0)
);

-- Torneos y Equipos
CREATE TABLE Torneo (
  id_torneo INT AUTO_INCREMENT NOT NULL,
  nombre_torneo VARCHAR(150) NOT NULL,
  torneo_inicio DATE NOT NULL,
  torneo_fin DATE NOT NULL,
  max_equipos INT NOT NULL,
  premio VARCHAR(150),
  id_categoria INT NOT NULL,
  id_formato INT NOT NULL,
  id_deporte INT NOT NULL,
  PRIMARY KEY (id_torneo),
  FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
  FOREIGN KEY (id_formato) REFERENCES Formato(id_formato),
  FOREIGN KEY (id_deporte) REFERENCES Deporte(id_deporte),
  CONSTRAINT ck_fechas_torneo CHECK (torneo_fin >= torneo_inicio),
  CONSTRAINT ck_max_equipos CHECK (max_equipos > 1)
);

CREATE TABLE Equipo (
  id_equipo INT AUTO_INCREMENT NOT NULL,
  nombre_equipo VARCHAR(70) NOT NULL,
  director_equipo VARCHAR(70) NOT NULL,
  localidad VARCHAR(150) NOT NULL,
  id_deporte INT NOT NULL,
  id_categoria INT NOT NULL,
  PRIMARY KEY (id_equipo),
  FOREIGN KEY (id_deporte) REFERENCES Deporte(id_deporte),
  FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
  UNIQUE (nombre_equipo)
);

-- Tablas de relación y Partidos
CREATE TABLE List_colaboradores (
  dni_usuario BIGINT NOT NULL,
  id_torneo INT NOT NULL,
  PRIMARY KEY (dni_usuario, id_torneo),
  FOREIGN KEY (dni_usuario) REFERENCES Usuario(dni_usuario),
  FOREIGN KEY (id_torneo) REFERENCES Torneo(id_torneo)
);

CREATE TABLE Plantilla_equipo (
  dni_jugador BIGINT NOT NULL,
  id_equipo INT NOT NULL,
  PRIMARY KEY (dni_jugador, id_equipo),
  FOREIGN KEY (dni_jugador) REFERENCES Jugador(dni_jugador),
  FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo)
);

CREATE TABLE Partido (
  id_partido INT AUTO_INCREMENT NOT NULL,
  marcador_local INT DEFAULT 0 NOT NULL,
  marcador_visitante INT DEFAULT 0 NOT NULL,
  id_estado INT NOT NULL,
  id_torneo INT NOT NULL,
  id_equipo_local INT NOT NULL,
  id_equipo_visitante INT NOT NULL,
  PRIMARY KEY (id_partido),
  FOREIGN KEY (id_estado) REFERENCES Estado_partido(id_estado),
  FOREIGN KEY (id_torneo) REFERENCES Torneo(id_torneo),
  FOREIGN KEY (id_equipo_local) REFERENCES Equipo(id_equipo),
  FOREIGN KEY (id_equipo_visitante) REFERENCES Equipo(id_equipo),
  CONSTRAINT ck_marcador_local CHECK (marcador_local >= 0),
  CONSTRAINT ck_marcador_visitante CHECK (marcador_visitante >= 0),
  CONSTRAINT ck_equipos_distintos CHECK (id_equipo_local <> id_equipo_visitante)
);

CREATE TABLE Torneo_equipo (
  id_torneo INT NOT NULL,
  id_equipo INT NOT NULL,
  PRIMARY KEY (id_torneo, id_equipo),
  FOREIGN KEY (id_torneo) REFERENCES Torneo(id_torneo),
  FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo)
);
