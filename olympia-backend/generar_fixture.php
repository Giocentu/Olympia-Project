<?php
header("Access-Control-Allow-Origin: *"); // Permite la conexión desde React
header("Access-Control-Allow-Methods: POST"); // Solo acepta peticiones de tipo POST
header("Access-Control-Allow-Headers: Content-Type"); // Permite cabeceras de tipo contenido
header("Content-Type: application/json; charset=UTF-8"); // Avisa que responderá en formato JSON

require 'conexion.php'; // Se conecta a la base de datos
$datos = json_decode(file_get_contents("php://input"), true); // Recibe y decodifica los datos de React como un array

if (!isset($datos['id_torneo'])) { die(json_encode(["status" => "error", "mensaje" => "Datos incompletos"])); } // Si falta el ID del torneo, frena todo

$id_torneo = $datos['id_torneo']; // Guarda el ID del torneo en una variable

try { // Inicia un bloque a prueba de errores
    $stmtF = $conn->prepare("SELECT formato_torneo FROM Torneo WHERE id_torneo = ?"); // Prepara la búsqueda del formato del torneo
    $stmtF->bind_param("i", $id_torneo); // Pone el ID en la consulta
    $stmtF->execute(); // Ejecuta la búsqueda
    $torneoInfo = $stmtF->get_result()->fetch_assoc(); // Extrae la fila con el resultado
    $stmtF->close(); // Cierra la consulta

    if (!$torneoInfo) { die(json_encode(["status" => "error", "mensaje" => "Torneo no encontrado"])); } // Si no existe el torneo, frena todo

    $formato = strtolower($torneoInfo['formato_torneo']); // Pasa el formato a minúsculas para compararlo fácil

    $stmt = $conn->prepare("SELECT id_equipo FROM Torneo_equipo WHERE id_torneo = ?"); // Busca qué equipos están en este torneo
    $stmt->bind_param("i", $id_torneo); // Asigna el ID
    $stmt->execute(); // Ejecuta
    $res = $stmt->get_result(); // Obtiene los resultados

    $equipos = []; // Crea una lista vacía
    while ($row = $res->fetch_assoc()) { $equipos[] = $row['id_equipo']; } // Mete todos los IDs de los equipos en la lista
    $stmt->close(); // Cierra consulta

    $num_equipos = count($equipos); // Cuenta cuántos equipos hay

    if ($num_equipos < 2) { die(json_encode(["status" => "error", "mensaje" => "Se requieren al menos 2 equipos asignados para generar un fixture."])); } // Valida mínimo general
    if (($formato === 'fase de grupos' || $formato === 'grupos') && $num_equipos < 4) { die(json_encode(["status" => "error", "mensaje" => "Fallo de validación Backend: El formato Grupos requiere un mínimo de 4 equipos."])); } // Valida mínimo para grupos

    shuffle($equipos); // Mezcla los equipos al azar para que el sorteo sea limpio

    $conn->begin_transaction(); // Inicia transaccion

    $stmtDel = $conn->prepare("DELETE FROM Partido WHERE id_torneo = ?"); // Prepara el borrado de partidos viejos de este torneo
    $stmtDel->bind_param("i", $id_torneo); // Asigna el ID
    if (!$stmtDel->execute()) { throw new Exception("Error al borrar partidos viejos: " . $stmtDel->error); } // Si falla el borrado, lanza un error y corta
    $stmtDel->close(); // Cierra consulta

    $resId = $conn->query("SELECT MAX(id_partido) as max_id FROM Partido"); // Busca el último ID de partido usado
    $rowId = $resId->fetch_assoc(); // Obtiene el resultado
    $next_id = ($rowId['max_id'] ? $rowId['max_id'] : 0) + 1; // Calcula el siguiente ID disponible

    // Prepara la plantilla para insertar los nuevos partidos. Los marcadores quedan en 0 y el estado en 'Programado'
    $stmtInsert = $conn->prepare("INSERT INTO Partido (id_partido, id_torneo, id_equipo_local, id_equipo_visitante, marcador_local, marcador_visitante, estado_partido, fase_jornada) VALUES (?, ?, ?, ?, 0, 0, 'Programado', ?)");

    // --- LÓGICA PARA FORMATO DE LIGA (Todos contra todos) ---
    if ($formato === 'liga') {
        if ($num_equipos % 2 != 0) { $equipos[] = null; $num_equipos++; } // Si son impares, agrega un equipo "fantasma" (descanso)
        $total_fechas = $num_equipos - 1; // Calcula cuántas fechas se juegan
        $mitad = $num_equipos / 2; // Calcula cuántos partidos hay por fecha

        for ($fecha = 1; $fecha <= $total_fechas; $fecha++) { // Bucle para cada fecha
            $nombre_jornada = "Fecha " . $fecha; // Nombra la jornada
            for ($i = 0; $i < $mitad; $i++) { // Bucle para cruzar los equipos
                $local = $equipos[$i]; // Primer equipo del cruce
                $visitante = $equipos[$num_equipos - 1 - $i]; // Último equipo del cruce
                if ($local !== null && $visitante !== null) { // Si ninguno es el "fantasma"
                    $stmtInsert->bind_param("iiiis", $next_id, $id_torneo, $local, $visitante, $nombre_jornada); // Carga los datos
                    if (!$stmtInsert->execute()) throw new Exception("Fallo en MySQL: " . $stmtInsert->error); // Guarda en BD.
                    $next_id++; // Aumenta el ID para el siguiente
                }
            }
            $ultimo = array_pop($equipos); // Saca al último equipo de la lista
            array_splice($equipos, 1, 0, [$ultimo]); // Lo mete en la segunda posición para rotarlos (algoritmo Round Robin)
        }
    }
    // --- LÓGICA PARA FASE DE GRUPOS ---
    elseif ($formato === 'fase de grupos' || $formato === 'grupos') {
        $tamano_grupo = 4; // Fija el tamaño base de cada grupo
        $num_grupos = max(1, ceil($num_equipos / $tamano_grupo)); // Calcula cuántos grupos armar
        $grupos = []; // Lista para armar los grupos
        $nombres_grupos = range('A', 'Z'); // Letras para nombrar los grupos

        for ($i = 0; $i < $num_equipos; $i++) { // Reparte los equipos uno por uno
            $idx_grupo = $i % $num_grupos; // Decide a qué grupo va
            $grupos[$idx_grupo][] = $equipos[$i]; // Lo guarda en su grupo
        }

        foreach ($grupos as $idx => $grupo_equipos) { // Recorre cada grupo creado
            $letra_grupo = $nombres_grupos[$idx]; // Asigna la letra al grupo (A, B, C...)
            $num_eq_grupo = count($grupo_equipos); // Cuenta equipos del grupo

            if ($num_eq_grupo % 2 != 0) { $grupo_equipos[] = null; $num_eq_grupo++; } // Si es impar, agrega equipo fantasma (descanso)
            $total_fechas = $num_eq_grupo - 1; // Calcula fechas del grupo
            $mitad = $num_eq_grupo / 2; // Calcula partidos por fecha en el grupo

            for ($fecha = 1; $fecha <= $total_fechas; $fecha++) { // Empieza a armar los partidos (Igual que liga pero por grupo)
                $nombre_jornada = "Grupo $letra_grupo - Fecha $fecha";
                for ($i = 0; $i < $mitad; $i++) {
                    $local = $grupo_equipos[$i];
                    $visitante = $grupo_equipos[$num_eq_grupo - 1 - $i];
                    if ($local !== null && $visitante !== null) {
                        $stmtInsert->bind_param("iiiis", $next_id, $id_torneo, $local, $visitante, $nombre_jornada);
                        if (!$stmtInsert->execute()) throw new Exception("Fallo en MySQL: " . $stmtInsert->error);
                        $next_id++;
                    }
                }
                $ultimo = array_pop($grupo_equipos);
                array_splice($grupo_equipos, 1, 0, [$ultimo]); // Rotación Round Robin
            }
        }
    }
    // --- LÓGICA PARA ELIMINATORIA DIRECTA ---
    elseif ($formato === 'eliminatoria') {
        $p2 = 1; while ($p2 < $num_equipos) { $p2 *= 2; } // Calcula la potencia de 2 más cercana (2, 4, 8, 16)

        $nombre_jornada = "Fase Preliminar"; // Nombra la jornada por defecto
        if ($p2 == 2) $nombre_jornada = "Final"; // Si encaja perfecto, le pone el nombre real
        elseif ($p2 == 4) $nombre_jornada = "Semifinal";
        elseif ($p2 == 8) $nombre_jornada = "Cuartos de Final";
        elseif ($p2 == 16) $nombre_jornada = "Octavos de Final";
        elseif ($p2 == 32) $nombre_jornada = "16avos de Final";

        $byes = $p2 - $num_equipos; // Calcula cuántos equipos pasan directo por no ser potencia de 2 exacta
        $equipos_a_jugar = $num_equipos - $byes; // Calcula cuántos sí tienen que jugar la fase preliminar

        for ($i = 0; $i < $equipos_a_jugar; $i += 2) { // Arma los cruces de 2 en 2
            $local = $equipos[$i]; // Agarra el equipo 1
            $visitante = $equipos[$i + 1]; // Agarra el equipo 2
            $stmtInsert->bind_param("iiiis", $next_id, $id_torneo, $local, $visitante, $nombre_jornada); // Carga datos
            if (!$stmtInsert->execute()) throw new Exception("Fallo en MySQL: " . $stmtInsert->error); // Inserta partido
            $next_id++;
        }
    }

    $stmtInsert->close(); // Cierra el insertador
    $conn->commit(); // Aplica todos los cambios definitivamente en la base de datos
    echo json_encode(["status" => "success", "mensaje" => "Fixture generado correctamente bajo el formato: " . ucfirst($formato) . "."]); // Responde éxito

} catch (Exception $e) { // Si algo falló en el bloque try ->
    $conn->rollback(); // Revierte cualquier cambio parcial para no dejar datos rotos
    echo json_encode(["status" => "error", "mensaje" => $e->getMessage()]); // Responde con el error
}
$conn->close(); // Cierra la
// RESUMEN: Crea automáticamente todos los partidos de un torneo basándose en los equipos inscritos y el formato (liga, grupos o // eliminatorias)
?>
