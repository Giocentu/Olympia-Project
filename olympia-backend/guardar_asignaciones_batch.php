<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require 'conexion.php';

// Leer los datos que manda React
$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['id_torneo']) || !isset($datos['equipos'])) {
    die(json_encode(["status" => "error", "mensaje" => "Datos incompletos"]));
}

$id_torneo = $datos['id_torneo'];
$equipos = $datos['equipos']; // Array con los IDs de los equipos finales

// Iniciamos una transacción de MySQL (si algo falla, se deshace todo)
$conn->begin_transaction();

try {
    // 1. Borrar todas las asignaciones actuales de este torneo
    $stmtDelete = $conn->prepare("DELETE FROM Torneo_equipo WHERE id_torneo = ?");
    $stmtDelete->bind_param("i", $id_torneo);
    $stmtDelete->execute();
    $stmtDelete->close();

    // 2. Insertar las nuevas asignaciones
    if (count($equipos) > 0) {
        $stmtInsert = $conn->prepare("INSERT INTO Torneo_equipo (id_torneo, id_equipo) VALUES (?, ?)");
        foreach ($equipos as $id_equipo) {
            $stmtInsert->bind_param("ii", $id_torneo, $id_equipo);
            $stmtInsert->execute();
        }
        $stmtInsert->close();
    }

    // 3. Confirmar los cambios
    $conn->commit();
    echo json_encode(["status" => "success", "mensaje" => "Equipos actualizados correctamente"]);

} catch (Exception $e) {
    // Si hubo un error, deshacemos los cambios
    $conn->rollback();
    echo json_encode(["status" => "error", "mensaje" => "Error al guardar en base de datos"]);
}

$conn->close();
?>
