<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require 'conexion.php';

if (!isset($_GET['id_torneo'])) {
    die(json_encode(["status" => "error", "mensaje" => "Falta el ID del torneo"]));
}

$id_torneo = $_GET['id_torneo'];

// Obtener formato
$stmtF = $conn->prepare("SELECT formato_torneo FROM Torneo WHERE id_torneo = ?");
$stmtF->bind_param("i", $id_torneo);
$stmtF->execute();
$torneo = $stmtF->get_result()->fetch_assoc();
$stmtF->close();

$formato = $torneo ? $torneo['formato_torneo'] : 'Desconocido';

// Obtener Partidos
// Asegúrate de tener la columna fase_jornada en tu BD
$sql = "SELECT
p.id_partido,
e1.nombre_equipo AS local,
e2.nombre_equipo AS visitante,
p.estado_partido,
p.fase_jornada
FROM Partido p
JOIN Equipo e1 ON p.id_equipo_local = e1.id_equipo
JOIN Equipo e2 ON p.id_equipo_visitante = e2.id_equipo
WHERE p.id_torneo = ?
ORDER BY p.id_partido ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_torneo);
$stmt->execute();
$resultado = $stmt->get_result();

$partidos = [];
while ($fila = $resultado->fetch_assoc()) {
    $partidos[] = $fila;
}

echo json_encode([
    "formato" => $formato,
    "partidos" => $partidos
]);

$stmt->close();
$conn->close();
?>
