<?php
header("Access-Control-Allow-Origin: *"); // CORS
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // CORS Métodos
header("Access-Control-Allow-Headers: Content-Type"); // CORS Cabeceras
header("Content-Type: application/json; charset=UTF-8"); // Respuesta JSON

require 'conexion.php'; // BD

// Consulta SQL con lógica interna: calcula si está Programado, Activo, o Finalizado
$sql = "SELECT id_torneo, nombre_torneo, deporte_torneo, CASE WHEN CURDATE() < torneo_inicio THEN 'Programado' WHEN CURDATE() BETWEEN torneo_inicio AND torneo_fin THEN 'Activo' WHEN CURDATE() > torneo_fin THEN 'Finalizado' END AS estado FROM Torneo ORDER BY torneo_inicio DESC";

$resultado = $conn->query($sql); // Ejecuta la consulta directa
$torneos = []; // Array vacío

if ($resultado && $resultado->num_rows > 0) { // Si la consulta funcionó y encontró torneos ->
    while ($fila = $resultado->fetch_assoc()) { $torneos[] = $fila; } // Llena el array con los torneos.
}

echo json_encode($torneos); // Envía la lista a React
$conn->close(); // Cierra BD
//RESUMEN: Lista todos los torneos disponibles y calcula automáticamente en qué estado se encuentran comparando las fechas con el día de hoy
?>
