<?php
header("Access-Control-Allow-Origin: *"); // CORS
header("Access-Control-Allow-Methods: POST"); // Solo acepta peticiones de tipo POST
header("Access-Control-Allow-Headers: Content-Type"); // Permite cabeceras de tipo contenido
header("Content-Type: application/json; charset=UTF-8"); // Responde en JSON

require 'conexion.php';  // Conexión BD

$datos = json_decode(file_get_contents("php://input"), true); // Lee datos

if (!isset($datos['id_torneo']) || !isset($datos['id_equipo']) || !isset($datos['accion'])) { die(json_encode(["status" => "error", "mensaje" => "Datos incompletos"])); } // Valida datos

$id_torneo = $datos['id_torneo']; // Variables locales
$id_equipo = $datos['id_equipo'];
$accion = $datos['accion']; // Saber si es 'asignar' o 'remover'

if ($accion === 'asignar') { // Si pidieron inscribir ->
    $stmt = $conn->prepare("INSERT INTO Torneo_equipo (id_torneo, id_equipo) VALUES (?, ?)"); // Prepara la inserción
    $stmt->bind_param("ii", $id_torneo, $id_equipo); // Pasa los IDs

    if ($stmt->execute()) { // Intenta insertar
        echo json_encode(["status" => "success", "mensaje" => "Equipo asignado"]); // Éxito
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al asignar equipo (Posiblemente ya esté asignado)"]); // Error (ej. duplicado)
    }
    $stmt->close(); // Cierra consulta

} else if ($accion === 'remover') { // Si pidieron quitar ->
    $stmt = $conn->prepare("DELETE FROM Torneo_equipo WHERE id_torneo = ? AND id_equipo = ?"); // Prepara el borrado
    $stmt->bind_param("ii", $id_torneo, $id_equipo); // Pasa los IDs

    if ($stmt->execute()) { // Intenta borrar
        echo json_encode(["status" => "success", "mensaje" => "Equipo removido"]); // Éxito
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al remover equipo"]); // Error
    }
    $stmt->close(); // Cierra consulta
} else { // Si mandan otra palabra rara en 'accion' ->
    echo json_encode(["status" => "error", "mensaje" => "Acción no válida"]); // Responde error
}
$conn->close(); // Cierra BD
// RESUMEN: Inscribe o elimina a un solo equipo dentro de un torneo dependiendo de la acción recibida.
?>
