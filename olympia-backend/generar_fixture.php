<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['id_torneo'])) {
    die(json_encode(["status" => "error", "mensaje" => "Datos incompletos"]));
}

$id_torneo = $datos['id_torneo'];

try {
    // 1. Obtener formato del torneo
    $stmtF = $conn->prepare("SELECT formato_torneo FROM Torneo WHERE id_torneo = ?");
    $stmtF->bind_param("i", $id_torneo);
    $stmtF->execute();
    $torneoInfo = $stmtF->get_result()->fetch_assoc();
    $stmtF->close();

    if (!$torneoInfo) {
        die(json_encode(["status" => "error", "mensaje" => "Torneo no encontrado"]));
    }

    $formato = $torneoInfo['formato_torneo'];

    // 2. Obtener equipos inscritos (Participantes actuales)
    $stmt = $conn->prepare("SELECT id_equipo FROM Torneo_equipo WHERE id_torneo = ?");
    $stmt->bind_param("i", $id_torneo);
    $stmt->execute();
    $res = $stmt->get_result();

    $equipos = [];
    while ($row = $res->fetch_assoc()) {
        $equipos[] = $row['id_equipo'];
    }
    $stmt->close();

    $num_equipos = count($equipos);
    if ($num_equipos < 2) {
        die(json_encode(["status" => "error", "mensaje" => "No hay suficientes equipos para un fixture."]));
    }

    // Mezclar aleatoriamente
    shuffle($equipos);

    $conn->begin_transaction();

    // =======================================================
    // CAMBIO CLAVE: ELIMINAR EL FIXTURE ANTERIOR SI EXISTE
    // =======================================================
    $stmtDel = $conn->prepare("DELETE FROM Partido WHERE id_torneo = ?");
    $stmtDel->bind_param("i", $id_torneo);
    $stmtDel->execute();
    $stmtDel->close();


    // Obtener el próximo ID de partido (Como pusimos AUTO_INCREMENT, MySQL podría hacerlo
    // solo, pero si tu consulta lo requiere lo manejamos por seguridad).
    $stmtInsert = $conn->prepare("INSERT INTO Partido (id_torneo, id_equipo_local, id_equipo_visitante, estado_partido, fase_jornada) VALUES (?, ?, ?, 'Pendiente', ?)");

    if (strtolower($formato) === 'liga') {
        // --- ALGORITMO ROUND-ROBIN (Todos contra todos) ---
        if ($num_equipos % 2 != 0) {
            $equipos[] = null; // null = Descanso
            $num_equipos++;
        }

        $total_fechas = $num_equipos - 1;
        $mitad = $num_equipos / 2;

        for ($fecha = 1; $fecha <= $total_fechas; $fecha++) {
            $nombre_jornada = "Fecha " . $fecha;

            for ($i = 0; $i < $mitad; $i++) {
                $local = $equipos[$i];
                $visitante = $equipos[$num_equipos - 1 - $i];

                if ($local !== null && $visitante !== null) {
                    // Cuidado: el orden es id_torneo, local, visitante, fase_jornada
                    $stmtInsert->bind
