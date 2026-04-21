<?php
header("Access-Control-Allow-Origin: *"); // CORS
header("Access-Control-Allow-Methods: POST, OPTIONS"); // CORS Métodos
header("Access-Control-Allow-Headers: Content-Type"); // CORS Cabeceras

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); } // Si es una petición de prueba del navegador, la aprueba y corta ahí

require 'conexion.php'; // BD
$data = json_decode(file_get_contents("php://input")); // Desempaqueta datos

if(isset($data->nombre_equipo)) { // Revisa que al menos tenga nombre

    $conn->begin_transaction(); // Inicia protección de datos. Si algo crashea a la mitad, no se guarda basura

    try {
        // Busca cuál es el ID más alto de equipo actual, y le suma 1 para usarlo en este equipo nuevo
        $result = $conn->query("SELECT COALESCE(MAX(id_equipo), 0) + 1 AS next_id FROM Equipo");
        $row = $result->fetch_assoc();
        $next_id = $row['next_id'];

        // Prepara el guardado en la tabla de Equipos
        $stmt = $conn->prepare("INSERT INTO Equipo (id_equipo, nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $next_id, $data->nombre_equipo, $data->descripcion_equipo, $data->categoria_equipo, $data->deporte_equipo); // 1 int, 4 strings
        $stmt->execute(); // Ejecuta guardado

        // Revisa si desde la interfaz nos mandaron también el ID de un torneo para inscribirlo
        if(!empty($data->id_torneo)) {
            // Lo inscribe inmediatamente relacionando ambos IDs en la tabla puente
            $stmtTorneo = $conn->prepare("INSERT INTO Torneo_equipo (id_torneo, id_equipo) VALUES (?, ?)");
            $stmtTorneo->bind_param("ii", $data->id_torneo, $next_id);
            $stmtTorneo->execute();
            $stmtTorneo->close();
        }

        $conn->commit(); // Confirma todos los cambios en la base de datos de una sola vez
        echo json_encode(["status" => "success", "mensaje" => "Equipo registrado exitosamente"]); // Devuelve mensaje feliz.

    } catch (Exception $e) { // Si algo salió mal en alguna de las inserciones ->
        $conn->rollback(); // Echa para atrás todo el proceso
        echo json_encode(["status" => "error", "mensaje" => "Fallo en la transacción: " . $e->getMessage()]); // Manda el error
    }
} else { // Si no vino el nombre del equipo ->
    echo json_encode(["status" => "error", "mensaje" => "Faltan datos obligatorios del equipo"]); // Mensaje de rechazo
}
$conn->close(); // Cierra BD
// RESUMEN: Guarda un nuevo equipo en el sistema y, si le indicamos, lo inscribe a un torneo en ese mismo instante. Todo mediante una transacción segura
?>
