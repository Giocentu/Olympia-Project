<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require 'conexion.php';

if (!isset($_GET['id_torneo'])) {
    die(json_encode(["status" => "error", "mensaje" => "Falta el ID del torneo"]));
}

$id_torneo = $_GET['id_torneo'];

// 1. Obtener detalles del torneo (Deporte, Categoría, Max Equipos)
$stmt = $conn->prepare("SELECT deporte_torneo, categoria_torneo, max_equipos FROM Torneo WHERE id_torneo = ?");
$stmt->bind_param("i", $id_torneo);
$stmt->execute();
$torneo = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$torneo) {
    die(json_encode(["status" => "error", "mensaje" => "Torneo no encontrado"]));
}

// 2. Obtener equipos YA ASIGNADOS
$stmtAsig = $conn->prepare("SELECT e.id_equipo, e.nombre_equipo FROM Equipo e JOIN Torneo_equipo te ON e.id_equipo = te.id_equipo WHERE te.id_torneo = ?");
$stmtAsig->bind_param("i", $id_torneo);
$stmtAsig->execute();
$resAsig = $stmtAsig->get_result();
$asignados = [];
while ($row = $resAsig->fetch_assoc()) { $asignados[] = $row; }
$stmtAsig->close();

// 3. Obtener equipos DISPONIBLES (Mismo deporte, misma categoría, y que no estén ya en Torneo_equipo)
$stmtDisp = $conn->prepare("
SELECT id_equipo, nombre_equipo
FROM Equipo
WHERE deporte_equipo = ?
AND categoria_equipo = ?
AND id_equipo NOT IN (SELECT id_equipo FROM Torneo_equipo WHERE id_torneo = ?)
");
$stmtDisp->bind_param("ssi", $torneo['deporte_torneo'], $torneo['categoria_torneo'], $id_torneo);
$stmtDisp->execute();
$resDisp = $stmtDisp->get_result();
$disponibles = [];
while ($row = $resDisp->fetch_assoc()) { $disponibles[] = $row; }
$stmtDisp->close();

// Devolvemos el paquete completo a React
echo json_encode([
    "status" => "success",
    "max_equipos" => $torneo['max_equipos'],
    "asignados" => $asignados,
    "disponibles" => $disponibles
]);

$conn->close();
?>
