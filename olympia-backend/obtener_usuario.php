<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'conexion.php';

// Esta consulta trae a TODOS los usuarios (jugadores incluidos)
// y junta sus roles si es que tienen alguno. Si no tienen, dice 'Sin rol asignado'
$sql = "
SELECT
U.dni_usuario,
U.nombre_usuario,
U.apellido_usuario,
U.email,
COALESCE(GROUP_CONCAT(R.nombre_rol SEPARATOR ', '), 'Sin rol asignado') AS roles_asignados
FROM Usuario U
LEFT JOIN Usuario_rol UR ON U.dni_usuario = UR.dni_usuario
LEFT JOIN Rol R ON UR.id_rol = R.id_rol
GROUP BY U.dni_usuario
ORDER BY U.nombre_usuario ASC
";

$result = $conn->query($sql);
$usuarios = array();

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
}

echo json_encode($usuarios);
$conn->close();
?>
