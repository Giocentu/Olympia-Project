<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require 'conexion.php';

// Usamos CASE para calcular el estado en tiempo real
$sql = "SELECT
id_torneo,
nombre_torneo,
deporte_torneo,
CASE
WHEN CURDATE() < torneo_inicio THEN 'Programado'
WHEN CURDATE() BETWEEN torneo_inicio AND torneo_fin THEN 'Activo'
WHEN CURDATE() > torneo_fin THEN 'Finalizado'
END AS estado
FROM Torneo
ORDER BY torneo_inicio DESC";

$resultado = $conn->query($sql);
$torneos = [];

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $torneos[] = $fila;
    }
}

echo json_encode($torneos);
$conn->close();
?>
