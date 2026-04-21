<?php
header("Access-Control-Allow-Origin: *"); // CORS
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // CORS Métodos
header("Access-Control-Allow-Headers: Content-Type"); // CORS Cabeceras
header("Content-Type: application/json; charset=UTF-8"); // Respuesta JSON

require 'conexion.php'; // BD

// Junta la tabla Usuarios con Roles. Usa GROUP_CONCAT para pegar los roles con comas si tiene varios. Si no tiene, pone 'Sin rol asignado'
$sql = "SELECT U.dni_usuario, U.nombre_usuario, U.apellido_usuario, U.email, COALESCE(GROUP_CONCAT(R.nombre_rol SEPARATOR ', '), 'Sin rol asignado') AS roles_asignados FROM Usuario U LEFT JOIN Usuario_rol UR ON U.dni_usuario = UR.dni_usuario LEFT JOIN Rol R ON UR.id_rol = R.id_rol GROUP BY U.dni_usuario ORDER BY U.nombre_usuario ASC";

$result = $conn->query($sql); // Ejecuta SQL
$usuarios = array(); // Prepara array

if ($result && $result->num_rows > 0) { // Si hay usuarios ->
    while($row = $result->fetch_assoc()) { $usuarios[] = $row; } // Los mete al array
}

echo json_encode($usuarios); // Manda el listado
$conn->close(); // Cierra BD
// RESUMEN: Trae una lista de todos los usuarios del sistema y agrupa los roles que tienen (si es que tienen alguno)
?>
