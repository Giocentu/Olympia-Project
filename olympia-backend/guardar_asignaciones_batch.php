<?php
header("Access-Control-Allow-Origin: *"); // CORS
header("Access-Control-Allow-Methods: POST"); // Solo acepta peticiones de tipo POST
header("Access-Control-Allow-Headers: Content-Type"); // Permite cabeceras de tipo contenido
header("Content-Type: application/json; charset=UTF-8");  // Responde en JSON

require 'conexion.php'; // Conexión BD

$datos = json_decode(file_get_contents("php://input"), true); // Lee datos

if (!isset($datos['id_torneo']) || !isset($datos['equipos'])) { die(json_encode(["status" => "error", "mensaje" => "Datos incompletos"])); } // Valida que lleguen torneo y equipos

$id_torneo = $datos['id_torneo']; // Asigna torneo
$equipos = $datos['equipos']; // Asigna la lista de IDs de equipos

$conn->begin_transaction(); // Inicia transaccion

try {
    $stmtDelete = $conn->prepare("DELETE FROM Torneo_equipo WHERE id_torneo = ?"); // Borra todos los equipos que estaban antes en este torneo
    $stmtDelete->bind_param("i", $id_torneo); // Pone el ID
    $stmtDelete->execute(); // Ejecuta el borrado
    $stmtDelete->close(); // Cierra borrado

    if (count($equipos) > 0) { // Si hay equipos en la nueva lista ->
        $stmtInsert = $conn->prepare("INSERT INTO Torneo_equipo (id_torneo, id_equipo) VALUES (?, ?)"); // Prepara el insertador
        foreach ($equipos as $id_equipo) { // Recorre la lista equipo por equipo
            $stmtInsert->bind_param("ii", $id_torneo, $id_equipo); // Pone los datos
            $stmtInsert->execute(); // Lo inserta
        }
        $stmtInsert->close(); // Cierra insertador
    }

    $conn->commit(); // Aplica los cambios
    echo json_encode(["status" => "success", "mensaje" => "Equipos actualizados correctamente"]); // Avisa que todo salió bien

} catch (Exception $e) { // Si algo sale mal ->
    $conn->rollback(); // Cancela los borrados e inserts para no romper nada
    echo json_encode(["status" => "error", "mensaje" => "Error al guardar en base de datos"]); // Avisa del error
}

$conn->close(); // Cierra BD
//RESUMEN: Actualiza la lista completa de equipos de un torneo (borra las inscripciones previas y guarda la nueva lista de golpe)
?>
