 CREATE DATABASE IF NOT EXISTS db_olympia;
 USE db_olympia;

-- ==============================================================================
--                               TABLAS MAESTRAS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- TABLA: Usuario
-- Descripción: Almacena la información personal de todos los usuarios del sistema.
-- ------------------------------------------------------------------------------
CREATE TABLE Usuario
(
  dni_usuario BIGINT NOT NULL,
  nombre_usuario VARCHAR(50) NOT NULL,
  apellido_usuario VARCHAR(50) NOT NULL,
  fecha_nac DATE NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefono_usuario VARCHAR(20), -- CORRECCIÓN: Los teléfonos no se operan matemáticamente y pueden contener '+', guiones o ceros a la izquierda.
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (dni_usuario)
);
-- Unicidad: Evita correos y teléfonos duplicados en el sistema
ALTER TABLE Usuario 
  ADD CONSTRAINT uq_usu_email UNIQUE (email),
  ADD CONSTRAINT uq_usu_tel UNIQUE (telefono_usuario);
ALTER TABLE Usuario 
  ADD CONSTRAINT chk_email_formato CHECK (email LIKE '%_@__%.__%'), -- Verifica que el email tenga una estructura básica válida (contenga un '@' y un punto de dominio)
  ADD CONSTRAINT chk_usu_nom CHECK (TRIM(nombre_usuario) <> ''),  -- Asegura que el nombre tenga al menos un caracter y no sean puros espacios en blanco
  ADD CONSTRAINT chk_usu_ape CHECK (TRIM(apellido_usuario) <> ''); -- Asegura que el apellido tenga al menos un caracter válido

-- ------------------------------------------------------------------------------
-- TABLAS DE CATÁLOGO (Formato, Categoría, Deporte, Rol)
-- Descripción: Tablas paramétricas para normalizar atributos de texto (3NF).
-- ------------------------------------------------------------------------------
CREATE TABLE Formato
(
  id_formato INT NOT NULL AUTO_INCREMENT,
  nombre_formato VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_formato)
);

ALTER TABLE Formato ADD CONSTRAINT chk_for_nom CHECK (TRIM(nombre_formato) <> ''); 


CREATE TABLE Categoria
(
  id_categoria INT NOT NULL AUTO_INCREMENT,
  nombre_categoria VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_categoria)
);

ALTER TABLE Categoria ADD CONSTRAINT chk_cat_nom CHECK (TRIM(nombre_categoria) <> ''); 


CREATE TABLE Deporte
(
  id_deporte INT NOT NULL AUTO_INCREMENT,
  nombre_deporte VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_deporte)
);

ALTER TABLE Deporte ADD CONSTRAINT chk_dep_nom CHECK (TRIM(nombre_deporte) <> ''); 

CREATE TABLE Rol
(
  id_rol INT NOT NULL AUTO_INCREMENT,
  nombre_rol VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_rol)
);

ALTER TABLE Rol ADD CONSTRAINT chk_rol_nom CHECK (TRIM(nombre_rol) <> ''); 
-- Unicidad: No pueden existir dos roles con el mismo nombre
ALTER TABLE Rol 
  ADD CONSTRAINT uq_rol_nom UNIQUE (nombre_rol);

INSERT INTO Rol (nombre_rol) VALUES 
('Super Administrador'),
('Organizador'),
('Capitan'),
('Asistente');


-- ==============================================================================
--                          TABLAS CON DEPENDENCIAS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- TABLA: Disciplina
-- Descripción: Entidad unificadora que combina un deporte con una categoría.
-- ------------------------------------------------------------------------------
CREATE TABLE Disciplina
(
  id_disciplina INT NOT NULL AUTO_INCREMENT,
  id_categoria INT NOT NULL,
  id_deporte INT NOT NULL,
  PRIMARY KEY (id_disciplina)
);

ALTER TABLE Disciplina 
  ADD CONSTRAINT fk_dis_cat FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
  ADD CONSTRAINT fk_dis_dep FOREIGN KEY (id_deporte) REFERENCES Deporte(id_deporte);


-- ------------------------------------------------------------------------------
-- TABLA: Torneo
-- Descripción: Almacena la configuración y reglas de los eventos deportivos.
-- ------------------------------------------------------------------------------
CREATE TABLE Torneo
(
  id_torneo INT NOT NULL AUTO_INCREMENT,
  nombre_torneo VARCHAR(150) NOT NULL,
  torneo_inicio DATE NOT NULL,
  torneo_fin DATE NOT NULL,
  max_equipos INT NOT NULL,
  id_formato INT NOT NULL,
  id_disciplina INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_torneo)
);

ALTER TABLE Torneo 
  ADD CONSTRAINT fk_tor_for FOREIGN KEY (id_formato) REFERENCES Formato(id_formato),
  ADD CONSTRAINT fk_tor_dis FOREIGN KEY (id_disciplina) REFERENCES Disciplina(id_disciplina);
-- Validación Lógica: Fechas coherentes y mínimo de participantes para competir
ALTER TABLE Torneo 
  ADD CONSTRAINT chk_tor_fec CHECK (torneo_fin >= torneo_inicio), 
  ADD CONSTRAINT chk_tor_max CHECK (max_equipos >= 2),            
  ADD CONSTRAINT chk_tor_nom CHECK (TRIM(nombre_torneo) <> '');   

-- ------------------------------------------------------------------------------
-- TABLA: Equipo
-- Descripción: Registra los equipos inscriptos en la plataforma.
-- ------------------------------------------------------------------------------
CREATE TABLE Equipo
(
  id_equipo INT NOT NULL AUTO_INCREMENT,
  nombre_equipo VARCHAR(70) NOT NULL,
  descripcion_equipo VARCHAR(200) NOT NULL,
  id_disciplina INT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_equipo)
);

ALTER TABLE Equipo 
  ADD CONSTRAINT fk_equ_dis FOREIGN KEY (id_disciplina) REFERENCES Disciplina(id_disciplina);

-- RESTRICCIÓN COMPUESTA : 
-- Evalúa el nombre y la disciplina como un paquete único. 
ALTER TABLE Equipo 
  ADD CONSTRAINT uq_equ_nom_dis UNIQUE (nombre_equipo, id_disciplina);
ALTER TABLE Equipo
  ADD CONSTRAINT chk_equ_nom CHECK (TRIM(nombre_equipo) <> ''); 

-- ------------------------------------------------------------------------------
-- TABLA: Partido
-- Descripción: Almacena los encuentros generados por el fixture de un torneo.
-- ------------------------------------------------------------------------------
CREATE TABLE Partido
(
  id_partido INT NOT NULL AUTO_INCREMENT,
  estado_partido VARCHAR(20) NOT NULL,
  fecha_partido DATE NOT NULL,
  id_torneo INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_partido)
);

ALTER TABLE Partido 
  ADD CONSTRAINT fk_par_tor FOREIGN KEY (id_torneo) REFERENCES Torneo(id_torneo) ON DELETE CASCADE;
-- Validación Lógica: Limita los estados posibles del partido
ALTER TABLE Partido 
  ADD CONSTRAINT chk_par_est CHECK (estado_partido IN ('Pendiente', 'En Juego', 'Finalizado', 'Suspendido')); 

-- ==============================================================================
--                     TABLAS ASOCIATIVAS 
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- TABLA: Colaborador_torneo  (Renombrada: Antes 'List_colaboradores')
-- Descripción: Registra al personal de apoyo asignado a un torneo específico.
-- ------------------------------------------------------------------------------
CREATE TABLE Colaborador_torneo
(
  fecha_registro DATE NOT NULL,
  dni_usuario BIGINT NOT NULL,
  id_torneo INT NOT NULL,
  id_rol INT NOT NULL,
  PRIMARY KEY (dni_usuario, id_torneo)
);

ALTER TABLE Colaborador_torneo 
  ADD CONSTRAINT fk_col_usu FOREIGN KEY (dni_usuario) REFERENCES Usuario(dni_usuario) ON DELETE CASCADE,
  ADD CONSTRAINT fk_col_tor FOREIGN KEY (id_torneo) REFERENCES Torneo(id_torneo) ON DELETE CASCADE,
  ADD CONSTRAINT fk_col_rol FOREIGN KEY (id_rol) REFERENCES Rol(id_rol);

-- ------------------------------------------------------------------------------
-- TABLA: Plantilla_equipo
-- Descripción: Gestiona la lista de jugadores que conforman un equipo.
-- ------------------------------------------------------------------------------
CREATE TABLE Plantilla_equipo
(
  posicion_equipo VARCHAR(30) NULL,
  nro_dorsal INT NOT NULL,
  id_equipo INT NOT NULL,
  dni_usuario BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_equipo, dni_usuario)
);

ALTER TABLE Plantilla_equipo 
  ADD CONSTRAINT fk_pla_equ FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo) ON DELETE CASCADE,
  ADD CONSTRAINT fk_pla_usu FOREIGN KEY (dni_usuario) REFERENCES Usuario(dni_usuario) ON DELETE CASCADE;
ALTER TABLE Plantilla_equipo
  ADD CONSTRAINT chk_dorsal_positivo CHECK (nro_dorsal >= 0),     
  ADD CONSTRAINT chk_pla_pos CHECK (posicion_equipo IN ('Capitan', 'Director Tecnico', 'Delantero', 'Medio Campista', 'Portero')); 

-- ------------------------------------------------------------------------------
-- TABLA: Torneo_equipo
-- Descripción: Historial de inscripciones de los equipos a los diferentes torneos.
-- NOTA LÓGICA: El Backend DEBE validar que el id_disciplina del Equipo coincida con el id_disciplina del Torneo.
-- ------------------------------------------------------------------------------
CREATE TABLE Torneo_equipo
(
  id_torneo INT NOT NULL,
  id_equipo INT NOT NULL,
  fecha_inscripcion DATE NOT NULL,
  estado_solicitud ENUM('Pendiente', 'Aceptado', 'Rechazado') DEFAULT 'Pendiente',
  PRIMARY KEY (id_torneo, id_equipo)
);

ALTER TABLE Torneo_equipo 
  ADD CONSTRAINT fk_teq_tor FOREIGN KEY (id_torneo) REFERENCES Torneo(id_torneo) ON DELETE CASCADE,
  ADD CONSTRAINT fk_teq_equ FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo) ON DELETE CASCADE;

-- ------------------------------------------------------------------------------
-- TABLA: Resultado_partido
-- Descripción: Almacena la puntuación final de cada equipo en un partido.
-- ------------------------------------------------------------------------------
CREATE TABLE Resultado_partido
(
  condicion VARCHAR(30) NOT NULL,
  puntuacion INT NOT NULL,
  id_partido INT NOT NULL,
  id_equipo INT NOT NULL,
  PRIMARY KEY (id_partido, id_equipo)
);

ALTER TABLE Resultado_partido 
  ADD CONSTRAINT fk_res_par FOREIGN KEY (id_partido) REFERENCES Partido(id_partido) ON DELETE CASCADE,
  ADD CONSTRAINT fk_res_equ FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo) ON DELETE CASCADE;
-- Validación Lógica: Reglas estrictas para los resultados
ALTER TABLE Resultado_partido 
  ADD CONSTRAINT chk_res_con CHECK (condicion IN ('Local', 'Visitante')), 
  ADD CONSTRAINT chk_res_pun CHECK (puntuacion >= 0),
  -- CORRECCIÓN: Evita que haya dos 'Locales' o dos 'Visitantes' en el mismo partido. Garantiza formato 1v1.
  ADD CONSTRAINT uq_res_con UNIQUE (id_partido, condicion);