<?php
header("Access-Control-Allow-Origin: *"); // Permite la conexión desde React
header("Content-Type: application/json; charset=UTF-8"); // Responde en JSON
require 'conexion.php'; // Se conecta a la BD

if (!isset($_GET['id_torneo'])) { die(json_encode(["status" => "error", "mensaje" => "Falta el ID del torneo"])); } // Corta si no llega el ID por la URL

$id_torneo = $_GET['id_torneo']; // Guarda el ID

$stmtF = $conn->prepare("SELECT formato_torneo FROM Torneo WHERE id_torneo = ?"); // Busca qué formato tiene el torneo
$stmtF->bind_param("i", $id_torneo); // Asigna ID
$stmtF->execute(); // Ejecuta
$torneo = $stmtF->get_result()->fetch_assoc(); // Trae el resultado
$stmtF->close(); // Cierra consulta

$formato = $torneo ? $torneo['formato_torneo'] : 'Desconocido'; // Guarda el formato, o dice "Desconocido" si no hay

// Prepara la consulta para buscar todos los partidos, cruzando datos para traer el nombre real de los equipos
$sql = "SELECT p.id_partido, e1.nombre_equipo AS local, e2.nombre_equipo AS visitante, p.estado_partido, p.fase_jornada FROM Partido p JOIN Equipo e1 ON p.id_equipo_local = e1.id_equipo JOIN Equipo e2 ON p.id_equipo_visitante = e2.id_equipo WHERE p.id_torneo = ? ORDER BY p.id_partido ASC";

$stmt = $conn->prepare($sql); // Prepara el SQL
$stmt->bind_param("i", $id_torneo); // Asigna el ID del torneo
$stmt->execute(); // Ejecuta
$resultado = $stmt->get_result(); // Recibe los partidos

$partidos = []; // Crea lista vacía
while ($fila = $resultado->fetch_assoc()) { $partidos[] = $fila; } // Llena la lista con los partidos encontrados

echo json_encode(["formato" => $formato, "partidos" => $partidos]); // Devuelve todo estructurado al frontend

$stmt->close(); // Cierra consulta
$conn->close(); // Cierra BD
//RESUMEN:Lee la base de datos y devuelve la lista de partidos de un torneo junto con el formato del mismo
?>
