<?php
header("Access-Control-Allow-Origin: *"); // CORS
header("Content-Type: application/json; charset=UTF-8"); // Responde en JSON
require 'conexion.php'; // Conexion DB

if (!isset($_GET['id_torneo'])) { die(json_encode(["status" => "error", "mensaje" => "Falta el ID del torneo"])); } // Verifica ID por URL

$id_torneo = $_GET['id_torneo']; // Asigna variable

//Averigua las reglas de este torneo (Deporte, Categoría y límite de equipos)
$stmt = $conn->prepare("SELECT deporte_torneo, categoria_torneo, max_equipos FROM Torneo WHERE id_torneo = ?");
$stmt->bind_param("i", $id_torneo);
$stmt->execute();
$torneo = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$torneo) { die(json_encode(["status" => "error", "mensaje" => "Torneo no encontrado"])); } // Frena si no existe

//Busca los equipos que YA están vinculados a este torneo
$stmtAsig = $conn->prepare("SELECT e.id_equipo, e.nombre_equipo FROM Equipo e JOIN Torneo_equipo te ON e.id_equipo = te.id_equipo WHERE te.id_torneo = ?");
$stmtAsig->bind_param("i", $id_torneo);
$stmtAsig->execute();
$resAsig = $stmtAsig->get_result();
$asignados = []; // Array de equipos ya adentro
while ($row = $resAsig->fetch_assoc()) { $asignados[] = $row; }
$stmtAsig->close();

// Busca los equipos que están AFUERA, pero que cumplen las reglas (mismo deporte y categoría)
$stmtDisp = $conn->prepare("SELECT id_equipo, nombre_equipo FROM Equipo WHERE deporte_equipo = ? AND categoria_equipo = ? AND id_equipo NOT IN (SELECT id_equipo FROM Torneo_equipo WHERE id_torneo = ?)");
$stmtDisp->bind_param("ssi", $torneo['deporte_torneo'], $torneo['categoria_torneo'], $id_torneo);
$stmtDisp->execute();
$resDisp = $stmtDisp->get_result();
$disponibles = []; // Array de equipos compatibles listos para sumar
while ($row = $resDisp->fetch_assoc()) { $disponibles[] = $row; }
$stmtDisp->close();

// Devuelve al front todo junto: límite, los que están adentro, y los que pueden entrar
echo json_encode(["status" => "success", "max_equipos" => $torneo['max_equipos'], "asignados" => $asignados, "disponibles" => $disponibles]);

$conn->close(); // Cierra BD
?>
