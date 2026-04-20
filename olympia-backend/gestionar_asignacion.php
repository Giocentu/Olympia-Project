<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require 'conexion.php';

// Leer los datos que manda React
$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['id_torneo']) || !isset($datos['id_equipo']) || !isset($datos['accion'])) {
    die(json_encode(["status" => "error", "mensaje" => "Datos incompletos"]));
}

$id_torneo = $datos['id_torneo'];
$id_equipo = $datos['id_equipo'];
$accion = $datos['accion'];

if ($accion === 'asignar') {
    // Insertar en Torneo_equipo
    $stmt = $conn->prepare("INSERT INTO Torneo_equipo (id_torneo, id_equipo) VALUES (?, ?)");
    $stmt->bind_param("ii", $id_torneo, $id_equipo);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "mensaje" => "Equipo asignado"]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al asignar equipo (Posiblemente ya esté asignado)"]);
    }
    $stmt->close();

} else if ($accion === 'remover') {
    // Eliminar de Torneo_equipo
    $stmt = $conn->prepare("DELETE FROM Torneo_equipo WHERE id_torneo = ? AND id_equipo = ?");
    $stmt->bind_param("ii", $id_torneo, $id_equipo);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "mensaje" => "Equipo removido"]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al remover equipo"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "mensaje" => "Acción no válida"]);
}

$conn->close();
?>
