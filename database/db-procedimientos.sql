-- ==============================================================================
-- SCRIPT DE PROCEDIMIENTOS ALMACENADOS PARA OLYMPIA (MYSQL)
-- ==============================================================================
-- NOTA PARA PHPMYADMIN (XAMPP):
-- * Si importas este archivo desde la pestaña "Importar", phpMyAdmin cambiará los delimitadores automáticamente.
-- * Si pegas este código directamente en la pestaña "SQL", debes cambiar el valor del campo "Delimitador"
--   (ubicado abajo a la derecha de la caja de texto de consulta) de ";" a "//" antes de hacer clic en "Continuar".
-- ==============================================================================
USE db_olympia;

-- ------------------------------------------------------------------------------
-- SECCIÓN 1: GESTIÓN DE USUARIOS Y ROLES
-- ------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS sp_BuscarUsuarioPorDni;
DELIMITER //
CREATE PROCEDURE sp_BuscarUsuarioPorDni(IN p_dni BIGINT)
BEGIN
    SELECT * FROM Usuario WHERE dni_usuario = p_dni;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_BuscarUsuarioPorEmail;
DELIMITER //
CREATE PROCEDURE sp_BuscarUsuarioPorEmail(IN p_email VARCHAR(150))
BEGIN
    SELECT * FROM Usuario WHERE LOWER(email) = LOWER(p_email);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ObtenerRolesUsuario;
DELIMITER //
CREATE PROCEDURE sp_ObtenerRolesUsuario(IN p_dni BIGINT)
BEGIN
    SELECT DISTINCT 
        CASE WHEN R.nombre_rol = 'Administrador' THEN 'SuperAdmin' ELSE R.nombre_rol END AS nombre_rol 
    FROM List_colaboradores LC
    INNER JOIN Rol R ON LC.id_rol = R.id_rol
    WHERE LC.dni_usuario = p_dni
    UNION
    SELECT 'Capitán' AS nombre_rol
    FROM Plantilla_equipo 
    WHERE dni_usuario = p_dni AND posicion_equipo = 'Capitán';
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ListarUsuariosConRoles;
DELIMITER //
CREATE PROCEDURE sp_ListarUsuariosConRoles()
BEGIN
    SELECT U.dni_usuario, 
           U.nombre_usuario, 
           U.apellido_usuario, 
           U.email, 
           U.fecha_nac,
           U.telefono_usuario,
           COALESCE(
               NULLIF(
                   CONCAT_WS(', ',
                       (SELECT GROUP_CONCAT(DISTINCT CASE WHEN r.nombre_rol = 'Administrador' THEN 'SuperAdmin' ELSE r.nombre_rol END SEPARATOR ', ')
                        FROM List_colaboradores lc
                        INNER JOIN Rol r ON lc.id_rol = r.id_rol
                        WHERE lc.dni_usuario = U.dni_usuario),
                       (SELECT 'Capitán' 
                        FROM Plantilla_equipo pe
                        WHERE pe.dni_usuario = U.dni_usuario AND pe.posicion_equipo = 'Capitán'
                        LIMIT 1)
                   ),
                   ''
               ),
               'Sin rol asignado'
           ) AS roles_asignados
    FROM Usuario U 
    ORDER BY U.nombre_usuario ASC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_GuardarUsuario;
DELIMITER //
CREATE PROCEDURE sp_GuardarUsuario(
    IN p_dni BIGINT,
    IN p_nombre VARCHAR(50),
    IN p_apellido VARCHAR(50),
    IN p_fecha_nac DATE,
    IN p_email VARCHAR(150),
    IN p_telefono BIGINT,
    IN p_password_hash VARCHAR(255),
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    SET p_resultado = 0;
    SET p_mensaje = '';
    
    -- Validar unicidad del email
    IF EXISTS(SELECT 1 FROM Usuario WHERE LOWER(email) = LOWER(p_email) AND dni_usuario != p_dni) THEN
        SET p_mensaje = 'El email ya se encuentra registrado por otro usuario';
    -- Validar unicidad del teléfono
    ELSEIF p_telefono IS NOT NULL AND EXISTS(SELECT 1 FROM Usuario WHERE telefono_usuario = p_telefono AND dni_usuario != p_dni) THEN
        SET p_mensaje = 'El teléfono ya se encuentra registrado por otro usuario';
    ELSE
        IF EXISTS(SELECT 1 FROM Usuario WHERE dni_usuario = p_dni) THEN
            -- Actualizar perfil
            UPDATE Usuario
            SET nombre_usuario = p_nombre,
                apellido_usuario = p_apellido,
                fecha_nac = p_fecha_nac,
                email = p_email,
                telefono_usuario = p_telefono,
                password_hash = p_password_hash
            WHERE dni_usuario = p_dni;
            SET p_resultado = 1;
            SET p_mensaje = 'Usuario actualizado correctamente';
        ELSE
            -- Insertar nuevo
            INSERT INTO Usuario (dni_usuario, nombre_usuario, apellido_usuario, fecha_nac, email, telefono_usuario, password_hash)
            VALUES (p_dni, p_nombre, p_apellido, p_fecha_nac, p_email, p_telefono, p_password_hash);
            SET p_resultado = 1;
            SET p_mensaje = 'Usuario registrado correctamente';
        END IF;
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_GuardarColaborador;
DELIMITER //
CREATE PROCEDURE sp_GuardarColaborador(
    IN p_dni BIGINT,
    IN p_id_torneo INT,
    IN p_id_rol INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    SET p_resultado = 0;
    SET p_mensaje = '';
    
    IF NOT EXISTS(SELECT 1 FROM Usuario WHERE dni_usuario = p_dni) THEN
        SET p_mensaje = 'El usuario no existe en el sistema';
    ELSEIF NOT EXISTS(SELECT 1 FROM Torneo WHERE id_torneo = p_id_torneo) THEN
        SET p_mensaje = 'El torneo no existe';
    ELSEIF NOT EXISTS(SELECT 1 FROM Rol WHERE id_rol = p_id_rol) THEN
        SET p_mensaje = 'El rol especificado no existe';
    ELSE
        INSERT INTO List_colaboradores (fecha_registro, dni_usuario, id_torneo, id_rol)
        VALUES (CURDATE(), p_dni, p_id_torneo, p_id_rol)
        ON DUPLICATE KEY UPDATE fecha_registro = CURDATE(), id_rol = p_id_rol;
        SET p_resultado = 1;
        SET p_mensaje = 'Colaborador guardado exitosamente';
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_EliminarColaboradoresPorDni;
DELIMITER //
CREATE PROCEDURE sp_EliminarColaboradoresPorDni(
    IN p_dni BIGINT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DELETE FROM List_colaboradores WHERE dni_usuario = p_dni;
    SET p_resultado = 1;
    SET p_mensaje = 'Colaboraciones eliminadas correctamente';
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_AsociarAPlantilla;
DELIMITER //
CREATE PROCEDURE sp_AsociarAPlantilla(
    IN p_dni BIGINT,
    IN p_id_equipo INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    SET p_resultado = 0;
    SET p_mensaje = '';
    
    IF NOT EXISTS(SELECT 1 FROM Usuario WHERE dni_usuario = p_dni) THEN
        SET p_mensaje = 'El usuario no existe';
    ELSEIF NOT EXISTS(SELECT 1 FROM Equipo WHERE id_equipo = p_id_equipo) THEN
        SET p_mensaje = 'El equipo no existe';
    ELSEIF EXISTS(SELECT 1 FROM Plantilla_equipo WHERE id_equipo = p_id_equipo AND dni_usuario = p_dni) THEN
        SET p_resultado = 1;
        SET p_mensaje = 'El jugador ya pertenece a este equipo';
    ELSE
        INSERT INTO Plantilla_equipo (posicion_equipo, nro_dorsal, id_equipo, dni_usuario)
        VALUES ('Jugador', 10, p_id_equipo, p_dni);
        SET p_resultado = 1;
        SET p_mensaje = 'Jugador asociado a plantilla exitosamente';
    END IF;
END //
DELIMITER ;


-- ------------------------------------------------------------------------------
-- SECCIÓN 2: GESTIÓN DE EQUIPOS Y DISCIPLINAS
-- ------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS sp_BuscarEquipoPorId;
DELIMITER //
CREATE PROCEDURE sp_BuscarEquipoPorId(IN p_id_equipo INT)
BEGIN
    SELECT e.*, d.nombre_deporte AS deporte_equipo, c.nombre_categoria AS categoria_equipo
    FROM Equipo e
    INNER JOIN Disciplina dis ON e.id_disciplina = dis.id_disciplina
    INNER JOIN Deporte d ON dis.id_deporte = d.id_deporte
    INNER JOIN Categoria c ON dis.id_categoria = c.id_categoria
    WHERE e.id_equipo = p_id_equipo;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ListarEquiposConDisciplina;
DELIMITER //
CREATE PROCEDURE sp_ListarEquiposConDisciplina()
BEGIN
    SELECT e.*, d.nombre_deporte AS deporte_equipo, c.nombre_categoria AS categoria_equipo
    FROM Equipo e
    INNER JOIN Disciplina dis ON e.id_disciplina = dis.id_disciplina
    INNER JOIN Deporte d ON dis.id_deporte = d.id_deporte
    INNER JOIN Categoria c ON dis.id_categoria = c.id_categoria
    ORDER BY e.nombre_equipo ASC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_BuscarEquiposPorTorneo;
DELIMITER //
CREATE PROCEDURE sp_BuscarEquiposPorTorneo(IN p_id_torneo INT)
BEGIN
    SELECT e.*, d.nombre_deporte AS deporte_equipo, c.nombre_categoria AS categoria_equipo
    FROM Equipo e
    INNER JOIN Torneo_equipo te ON e.id_equipo = te.id_equipo
    INNER JOIN Disciplina dis ON e.id_disciplina = dis.id_disciplina
    INNER JOIN Deporte d ON dis.id_deporte = d.id_deporte
    INNER JOIN Categoria c ON dis.id_categoria = c.id_categoria
    WHERE te.id_torneo = p_id_torneo
    ORDER BY e.nombre_equipo ASC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_BuscarEquiposDisponiblesParaTorneo;
DELIMITER //
CREATE PROCEDURE sp_BuscarEquiposDisponiblesParaTorneo(IN p_id_torneo INT)
BEGIN
    -- Mismo deporte y categoría del torneo, que no estén ya inscritos
    DECLARE v_disciplina INT;
    
    SELECT id_disciplina INTO v_disciplina FROM Torneo WHERE id_torneo = p_id_torneo;
    
    SELECT e.*, d.nombre_deporte AS deporte_equipo, c.nombre_categoria AS categoria_equipo
    FROM Equipo e
    INNER JOIN Disciplina dis ON e.id_disciplina = dis.id_disciplina
    INNER JOIN Deporte d ON dis.id_deporte = d.id_deporte
    INNER JOIN Categoria c ON dis.id_categoria = c.id_categoria
    WHERE e.id_disciplina = v_disciplina
      AND e.id_equipo NOT IN (SELECT id_equipo FROM Torneo_equipo WHERE id_torneo = p_id_torneo)
    ORDER BY e.nombre_equipo ASC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ObtenerOInsertarDisciplina;
DELIMITER //
CREATE PROCEDURE sp_ObtenerOInsertarDisciplina(
    IN p_deporte VARCHAR(30),
    IN p_categoria VARCHAR(20),
    OUT p_id_disciplina INT
)
BEGIN
    DECLARE v_id_dep INT;
    DECLARE v_id_cat INT;
    
    -- Deporte
    SELECT id_deporte INTO v_id_dep FROM Deporte WHERE LOWER(nombre_deporte) = LOWER(p_deporte) LIMIT 1;
    IF v_id_dep IS NULL THEN
        INSERT INTO Deporte (nombre_deporte) VALUES (p_deporte);
        SET v_id_dep = LAST_INSERT_ID();
    END IF;
    
    -- Categoría
    SELECT id_categoria INTO v_id_cat FROM Categoria WHERE LOWER(nombre_categoria) = LOWER(p_categoria) LIMIT 1;
    IF v_id_cat IS NULL THEN
        INSERT INTO Categoria (nombre_categoria) VALUES (p_categoria);
        SET v_id_cat = LAST_INSERT_ID();
    END IF;
    
    -- Disciplina
    SELECT id_disciplina INTO p_id_disciplina FROM Disciplina WHERE id_deporte = v_id_dep AND id_categoria = v_id_cat LIMIT 1;
    IF p_id_disciplina IS NULL THEN
        INSERT INTO Disciplina (id_categoria, id_deporte) VALUES (v_id_cat, v_id_dep);
        SET p_id_disciplina = LAST_INSERT_ID();
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_GuardarEquipo;
DELIMITER //
CREATE PROCEDURE sp_GuardarEquipo(
    IN p_id_equipo INT,
    IN p_nombre VARCHAR(70),
    IN p_descripcion VARCHAR(200),
    IN p_deporte VARCHAR(30),
    IN p_categoria VARCHAR(20),
    OUT p_id_generado INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_disciplina INT;
    SET p_resultado = 0;
    SET p_mensaje = '';
    SET p_id_generado = p_id_equipo;

    -- Resolver disciplina
    CALL sp_ObtenerOInsertarDisciplina(p_deporte, p_categoria, v_disciplina);

    -- Validar unicidad (Nombre, Disciplina)
    IF EXISTS(SELECT 1 FROM Equipo WHERE nombre_equipo = p_nombre AND id_disciplina = v_disciplina AND id_equipo != COALESCE(p_id_equipo, 0)) THEN
        SET p_mensaje = 'Ya existe un equipo con ese nombre para la misma disciplina deportiva';
    ELSE
        IF p_id_equipo IS NOT NULL AND EXISTS(SELECT 1 FROM Equipo WHERE id_equipo = p_id_equipo) THEN
            -- Actualizar
            UPDATE Equipo
            SET nombre_equipo = p_nombre,
                descripcion_equipo = p_descripcion,
                id_disciplina = v_disciplina
            WHERE id_equipo = p_id_equipo;
            SET p_resultado = 1;
            SET p_mensaje = 'Equipo actualizado correctamente';
        ELSE
            -- Insertar
            INSERT INTO Equipo (nombre_equipo, descripcion_equipo, id_disciplina)
            VALUES (p_nombre, p_descripcion, v_disciplina);
            SET p_id_generado = LAST_INSERT_ID();
            SET p_resultado = 1;
            SET p_mensaje = 'Equipo registrado correctamente';
        END IF;
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_InscribirEquipoEnTorneo;
DELIMITER //
CREATE PROCEDURE sp_InscribirEquipoEnTorneo(
    IN p_id_equipo INT,
    IN p_id_torneo INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_inscritos INT;
    DECLARE v_capacidad INT;

    SET p_resultado = 0;
    SET p_mensaje = '';
    
    IF EXISTS(SELECT 1 FROM Torneo_equipo WHERE id_torneo = p_id_torneo AND id_equipo = p_id_equipo) THEN
        SET p_resultado = 1;
        SET p_mensaje = 'El equipo ya está inscrito en el torneo';
    ELSE
        -- Verificar capacidad del torneo
        SELECT COUNT(*) INTO v_inscritos FROM Torneo_equipo WHERE id_torneo = p_id_torneo;
        SELECT max_equipos INTO v_capacidad FROM Torneo WHERE id_torneo = p_id_torneo;
        
        IF v_inscritos >= v_capacidad THEN
            SET p_mensaje = 'El torneo ya se encuentra en su máxima capacidad';
        ELSE
            INSERT INTO Torneo_equipo (fecha_inscripcion, id_torneo, id_equipo)
            VALUES (CURDATE(), p_id_torneo, p_id_equipo);
            SET p_resultado = 1;
            SET p_mensaje = 'Equipo inscrito correctamente en el torneo';
        END IF;
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_DesinscribirEquipoDeTorneo;
DELIMITER //
CREATE PROCEDURE sp_DesinscribirEquipoDeTorneo(
    IN p_id_equipo INT,
    IN p_id_torneo INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DELETE FROM Torneo_equipo WHERE id_torneo = p_id_torneo AND id_equipo = p_id_equipo;
    SET p_resultado = 1;
    SET p_mensaje = 'Inscripción removida exitosamente';
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_EliminarInscripcionesTorneo;
DELIMITER //
CREATE PROCEDURE sp_EliminarInscripcionesTorneo(
    IN p_id_torneo INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DELETE FROM Torneo_equipo WHERE id_torneo = p_id_torneo;
    SET p_resultado = 1;
    SET p_mensaje = 'Inscripciones de equipos del torneo limpiadas exitosamente';
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ObtenerCantidadJugadores;
DELIMITER //
CREATE PROCEDURE sp_ObtenerCantidadJugadores(
    IN p_id_equipo INT,
    OUT p_total INT
)
BEGIN
    SELECT COUNT(*) INTO p_total FROM Plantilla_equipo WHERE id_equipo = p_id_equipo;
END //
DELIMITER ;


-- ------------------------------------------------------------------------------
-- SECCIÓN 3: GESTIÓN DE TORNEOS Y ASISTENTES
-- ------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS sp_BuscarTorneoPorId;
DELIMITER //
CREATE PROCEDURE sp_BuscarTorneoPorId(IN p_id_torneo INT)
BEGIN
    SELECT t.id_torneo, t.nombre_torneo, t.torneo_inicio, t.torneo_fin, t.max_equipos, t.id_formato, t.id_disciplina,
           CASE WHEN t.updated_at >= NOW() - INTERVAL 5 MINUTE THEN t.pin_asistente ELSE NULL END AS pin_asistente,
           t.created_at, t.updated_at,
           f.nombre_formato, dep.nombre_deporte, cat.nombre_categoria
    FROM Torneo t
    INNER JOIN Formato f ON t.id_formato = f.id_formato
    INNER JOIN Disciplina d ON t.id_disciplina = d.id_disciplina
    INNER JOIN Deporte dep ON d.id_deporte = dep.id_deporte
    INNER JOIN Categoria cat ON d.id_categoria = cat.id_categoria
    WHERE t.id_torneo = p_id_torneo;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ListarTorneos;
DELIMITER //
CREATE PROCEDURE sp_ListarTorneos()
BEGIN
    SELECT t.id_torneo, t.nombre_torneo, t.torneo_inicio, t.torneo_fin, t.max_equipos, t.id_formato, t.id_disciplina,
           CASE WHEN t.updated_at >= NOW() - INTERVAL 5 MINUTE THEN t.pin_asistente ELSE NULL END AS pin_asistente,
           t.created_at, t.updated_at,
           f.nombre_formato, dep.nombre_deporte, cat.nombre_categoria
    FROM Torneo t
    INNER JOIN Formato f ON t.id_formato = f.id_formato
    INNER JOIN Disciplina d ON t.id_disciplina = d.id_disciplina
    INNER JOIN Deporte dep ON d.id_deporte = dep.id_deporte
    INNER JOIN Categoria cat ON d.id_categoria = cat.id_categoria
    ORDER BY t.created_at DESC, t.id_torneo DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_BuscarFormatoPorNombre;
DELIMITER //
CREATE PROCEDURE sp_BuscarFormatoPorNombre(
    IN p_nombre VARCHAR(30),
    OUT p_id_formato INT
)
BEGIN
    SELECT id_formato INTO p_id_formato FROM Formato WHERE LOWER(nombre_formato) = LOWER(p_nombre) LIMIT 1;
    IF p_id_formato IS NULL THEN
        INSERT INTO Formato (nombre_formato) VALUES (p_nombre);
        SET p_id_formato = LAST_INSERT_ID();
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_GuardarTorneo;
DELIMITER //
CREATE PROCEDURE sp_GuardarTorneo(
    IN p_id_torneo INT,
    IN p_nombre VARCHAR(150),
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_max_equipos INT,
    IN p_formato VARCHAR(30),
    IN p_deporte VARCHAR(30),
    IN p_categoria VARCHAR(20),
    IN p_pin VARCHAR(6),
    OUT p_id_generado INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_id_formato INT;
    DECLARE v_id_disciplina INT;
    SET p_resultado = 0;
    SET p_mensaje = '';
    SET p_id_generado = p_id_torneo;
    
    -- Validaciones lógicas iniciales
    IF p_fecha_fin < p_fecha_inicio THEN
        SET p_mensaje = 'La fecha de finalización debe ser posterior o igual a la de inicio';
    ELSEIF p_max_equipos < 2 THEN
        SET p_mensaje = 'La capacidad máxima de equipos debe ser mayor o igual a 2';
    ELSE
        -- Resolver formato y disciplina
        CALL sp_BuscarFormatoPorNombre(p_formato, v_id_formato);
        CALL sp_ObtenerOInsertarDisciplina(p_deporte, p_categoria, v_id_disciplina);
        
        IF p_id_torneo IS NOT NULL AND EXISTS(SELECT 1 FROM Torneo WHERE id_torneo = p_id_torneo) THEN
            -- Actualizar
            UPDATE Torneo
            SET nombre_torneo = p_nombre,
                torneo_inicio = p_fecha_inicio,
                torneo_fin = p_fecha_fin,
                max_equipos = p_max_equipos,
                id_formato = v_id_formato,
                id_disciplina = v_id_disciplina,
                pin_asistente = p_pin
            WHERE id_torneo = p_id_torneo;
            SET p_resultado = 1;
            SET p_mensaje = 'Torneo actualizado correctamente';
        ELSE
            -- Insertar
            INSERT INTO Torneo (nombre_torneo, torneo_inicio, torneo_fin, max_equipos, id_formato, id_disciplina, pin_asistente)
            VALUES (p_nombre, p_fecha_inicio, p_fecha_fin, p_max_equipos, v_id_formato, v_id_disciplina, p_pin);
            SET p_id_generado = LAST_INSERT_ID();
            SET p_resultado = 1;
            SET p_mensaje = 'Torneo registrado correctamente';
        END IF;
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_AsignarPinAsistente;
DELIMITER //
CREATE PROCEDURE sp_AsignarPinAsistente(
    IN p_id_torneo INT,
    IN p_pin VARCHAR(6),
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    SET p_resultado = 0;
    SET p_mensaje = '';
    
    IF NOT EXISTS(SELECT 1 FROM Torneo WHERE id_torneo = p_id_torneo) THEN
        SET p_mensaje = 'El torneo especificado no existe';
    ELSE
        UPDATE Torneo
        SET pin_asistente = p_pin
        WHERE id_torneo = p_id_torneo;
        SET p_resultado = 1;
        SET p_mensaje = 'Código PIN asignado exitosamente';
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_VerificarPinAsistente;
DELIMITER //
CREATE PROCEDURE sp_VerificarPinAsistente(
    IN p_pin VARCHAR(6),
    OUT p_id_torneo INT,
    OUT p_nombre_torneo VARCHAR(150)
)
BEGIN
    SET p_id_torneo = NULL;
    SET p_nombre_torneo = NULL;
    
    SELECT id_torneo, nombre_torneo INTO p_id_torneo, p_nombre_torneo 
    FROM Torneo 
    WHERE pin_asistente = p_pin 
      AND updated_at >= NOW() - INTERVAL 5 MINUTE
    LIMIT 1;
END //
DELIMITER ;


-- ------------------------------------------------------------------------------
-- SECCIÓN 4: GESTIÓN DE PARTIDOS, RESULTADOS Y FIXTURE
-- ------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS sp_BuscarPartidoPorId;
DELIMITER //
CREATE PROCEDURE sp_BuscarPartidoPorId(IN p_id_partido INT)
BEGIN
    SELECT * FROM Partido WHERE id_partido = p_id_partido;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_BuscarResultadosPartido;
DELIMITER //
CREATE PROCEDURE sp_BuscarResultadosPartido(IN p_id_partido INT)
BEGIN
    SELECT id_equipo, condicion, puntuacion FROM Resultado_partido WHERE id_partido = p_id_partido;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_BuscarPartidosPorTorneo;
DELIMITER //
CREATE PROCEDURE sp_BuscarPartidosPorTorneo(IN p_id_torneo INT)
BEGIN
    SELECT p.*,
           rl.id_equipo AS id_equipo_local,
           rl.puntuacion AS marcador_local,
           el.nombre_equipo AS equipo_local_nombre,
           rv.id_equipo AS id_equipo_visitante,
           rv.puntuacion AS marcador_visitante,
           ev.nombre_equipo AS equipo_visitante_nombre
    FROM Partido p
    LEFT JOIN Resultado_partido rl ON p.id_partido = rl.id_partido AND rl.condicion = 'Local'
    LEFT JOIN Equipo el ON rl.id_equipo = el.id_equipo
    LEFT JOIN Resultado_partido rv ON p.id_partido = rv.id_partido AND rv.condicion = 'Visitante'
    LEFT JOIN Equipo ev ON rv.id_equipo = ev.id_equipo
    WHERE p.id_torneo = p_id_torneo
    ORDER BY p.fase_jornada ASC, p.id_partido ASC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_LimpiarPartidosTorneo;
DELIMITER //
CREATE PROCEDURE sp_LimpiarPartidosTorneo(
    IN p_id_torneo INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    -- Borrar primero de Resultado_partido para evitar fallas de restricción de clave foránea
    DELETE FROM Resultado_partido WHERE id_partido IN (SELECT id_partido FROM Partido WHERE id_torneo = p_id_torneo);
    
    DELETE FROM Partido WHERE id_torneo = p_id_torneo;
    SET p_resultado = 1;
    SET p_mensaje = 'Fixture anterior eliminado correctamente';
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_GuardarPartido;
DELIMITER //
CREATE PROCEDURE sp_GuardarPartido(
    IN p_id_partido INT,
    IN p_id_torneo INT,
    IN p_estado VARCHAR(20),
    IN p_fecha DATE,
    IN p_fase VARCHAR(50),
    IN p_id_equipo_local INT,
    IN p_id_equipo_vis INT,
    IN p_puntos_local INT,
    IN p_puntos_vis INT,
    IN p_condicion_local VARCHAR(30),
    IN p_condicion_vis VARCHAR(30),
    OUT p_id_generado INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    SET p_resultado = 0;
    SET p_mensaje = '';
    SET p_id_generado = p_id_partido;

    IF p_id_partido IS NOT NULL AND EXISTS(SELECT 1 FROM Partido WHERE id_partido = p_id_partido) THEN
        -- Actualizar partido
        UPDATE Partido
        SET estado_partido = p_estado,
            fecha_partido = p_fecha,
            id_torneo = p_id_torneo,
            fase_jornada = p_fase
        WHERE id_partido = p_id_partido;

        -- Actualizar resultados (Local y Visitante)
        UPDATE Resultado_partido
        SET puntuacion = p_puntos_local, condicion = p_condicion_local
        WHERE id_partido = p_id_partido AND id_equipo = p_id_equipo_local;

        UPDATE Resultado_partido
        SET puntuacion = p_puntos_vis, condicion = p_condicion_vis
        WHERE id_partido = p_id_partido AND id_equipo = p_id_equipo_vis;

        SET p_resultado = 1;
        SET p_mensaje = 'Partido y marcadores actualizados exitosamente';
    ELSE
        -- Insertar partido
        INSERT INTO Partido (estado_partido, fecha_partido, id_torneo, fase_jornada)
        VALUES (p_estado, p_fecha, p_id_torneo, p_fase);
        SET p_id_generado = LAST_INSERT_ID();

        -- Insertar resultados asociados
        INSERT INTO Resultado_partido (condicion, puntuacion, id_partido, id_equipo)
        VALUES (p_condicion_local, p_puntos_local, p_id_generado, p_id_equipo_local);

        INSERT INTO Resultado_partido (condicion, puntuacion, id_partido, id_equipo)
        VALUES (p_condicion_vis, p_puntos_vis, p_id_generado, p_id_equipo_vis);

        SET p_resultado = 1;
        SET p_mensaje = 'Partido y marcadores creados exitosamente';
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ActualizarResultadoPartido;
DELIMITER //
CREATE PROCEDURE sp_ActualizarResultadoPartido(
    IN p_id_partido INT,
    IN p_estado VARCHAR(20),
    IN p_puntos_local INT,
    IN p_puntos_vis INT,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_local_id INT;
    DECLARE v_vis_id INT;
    SET p_resultado = 0;
    SET p_mensaje = '';
    
    -- Localizar los IDs de equipo para local y visitante
    SELECT id_equipo INTO v_local_id FROM Resultado_partido WHERE id_partido = p_id_partido AND condicion = 'Local' LIMIT 1;
    SELECT id_equipo INTO v_vis_id FROM Resultado_partido WHERE id_partido = p_id_partido AND condicion = 'Visitante' LIMIT 1;
    
    IF v_local_id IS NULL OR v_vis_id IS NULL THEN
        SET p_mensaje = 'No se encontraron los equipos configurados para este partido';
    ELSE
        UPDATE Partido SET estado_partido = p_estado WHERE id_partido = p_id_partido;
        UPDATE Resultado_partido SET puntuacion = p_puntos_local WHERE id_partido = p_id_partido AND id_equipo = v_local_id;
        UPDATE Resultado_partido SET puntuacion = p_puntos_vis WHERE id_partido = p_id_partido AND id_equipo = v_vis_id;
        
        SET p_resultado = 1;
        SET p_mensaje = 'Marcador actualizado exitosamente';
    END IF;
END //
DELIMITER ;


-- ------------------------------------------------------------------------------
-- SECCIÓN 5: GESTIÓN DE SOLICITUDES DE INSCRIPCIÓN
-- ------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS sp_BuscarSolicitudPorId;
DELIMITER //
CREATE PROCEDURE sp_BuscarSolicitudPorId(IN p_id_solicitud VARCHAR(50))
BEGIN
    SELECT * FROM Solicitud WHERE id_solicitud = p_id_solicitud;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ListarSolicitudes;
DELIMITER //
CREATE PROCEDURE sp_ListarSolicitudes()
BEGIN
    SELECT s.*, t.nombre_torneo, e.nombre_equipo, dep.nombre_deporte AS deporte_torneo
    FROM Solicitud s
    INNER JOIN Torneo t ON s.id_torneo = t.id_torneo
    INNER JOIN Equipo e ON s.id_equipo = e.id_equipo
    INNER JOIN Disciplina d ON t.id_disciplina = d.id_disciplina
    INNER JOIN Deporte dep ON d.id_deporte = dep.id_deporte
    ORDER BY s.fecha_solicitud DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ListarSolicitudesPorOrganizador;
DELIMITER //
CREATE PROCEDURE sp_ListarSolicitudesPorOrganizador(IN p_dni_organizador BIGINT)
BEGIN
    SELECT s.*, t.nombre_torneo, e.nombre_equipo, dep.nombre_deporte AS deporte_torneo
    FROM Solicitud s
    INNER JOIN Torneo t ON s.id_torneo = t.id_torneo
    INNER JOIN Equipo e ON s.id_equipo = e.id_equipo
    INNER JOIN Disciplina d ON t.id_disciplina = d.id_disciplina
    INNER JOIN Deporte dep ON d.id_deporte = dep.id_deporte
    INNER JOIN List_colaboradores LC ON t.id_torneo = LC.id_torneo
    WHERE LC.dni_usuario = p_dni_organizador AND LC.id_rol = 2
    ORDER BY s.fecha_solicitud DESC;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_CheckSolicitudDuplicada;
DELIMITER //
CREATE PROCEDURE sp_CheckSolicitudDuplicada(
    IN p_id_equipo INT,
    IN p_id_torneo INT,
    OUT p_duplicado INT
)
BEGIN
    IF EXISTS(
        SELECT 1 FROM Solicitud 
        WHERE id_equipo = p_id_equipo AND id_torneo = p_id_torneo AND estado_solicitud IN ('Pendiente', 'Aprobado')
    ) THEN
        SET p_duplicado = 1;
    ELSE
        SET p_duplicado = 0;
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_GuardarSolicitud;
DELIMITER //
CREATE PROCEDURE sp_GuardarSolicitud(
    IN p_id_solicitud VARCHAR(50),
    IN p_id_torneo INT,
    IN p_id_equipo INT,
    IN p_estado VARCHAR(20),
    IN p_fecha DATE,
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    SET p_resultado = 0;
    SET p_mensaje = '';
    
    IF EXISTS(SELECT 1 FROM Solicitud WHERE id_solicitud = p_id_solicitud) THEN
        UPDATE Solicitud
        SET id_torneo = p_id_torneo,
            id_equipo = p_id_equipo,
            estado_solicitud = p_estado,
            fecha_solicitud = p_fecha
        WHERE id_solicitud = p_id_solicitud;
        SET p_resultado = 1;
        SET p_mensaje = 'Solicitud actualizada correctamente';
    ELSE
        INSERT INTO Solicitud (id_solicitud, id_torneo, id_equipo, estado_solicitud, fecha_solicitud)
        VALUES (p_id_solicitud, p_id_torneo, p_id_equipo, p_estado, p_fecha);
        SET p_resultado = 1;
        SET p_mensaje = 'Solicitud registrada correctamente';
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ActualizarEstadoSolicitud;
DELIMITER //
CREATE PROCEDURE sp_ActualizarEstadoSolicitud(
    IN p_id_solicitud VARCHAR(50),
    IN p_estado VARCHAR(20),
    OUT p_resultado INT,
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    SET p_resultado = 0;
    SET p_mensaje = '';
    
    IF NOT EXISTS(SELECT 1 FROM Solicitud WHERE id_solicitud = p_id_solicitud) THEN
        SET p_mensaje = 'La solicitud no existe';
    ELSE
        UPDATE Solicitud
        SET estado_solicitud = p_estado
        WHERE id_solicitud = p_id_solicitud;
        SET p_resultado = 1;
        SET p_mensaje = 'Estado de solicitud actualizado correctamente';
    END IF;
END //
DELIMITER ;
