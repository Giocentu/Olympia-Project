<?php
// Estas 2 líneas son vitales para que React pueda leer los datos
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'conexion.php';

try {
    // Verifica que los nombres de las columnas coincidan con tu db-olympia.sql
    $stmt = $conexion->query("SELECT id_deporte, nombre_deporte FROM Deporte");
    $deportes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($deportes);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
