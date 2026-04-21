<?php
header("Access-Control-Allow-Origin: *"); // Permite que cualquier origen acceda a este archivo
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Autoriza peticiones de tipo POST y OPTIONS
header("Access-Control-Allow-Headers: Content-Type"); // Autoriza el envío de cabeceras de tipo Content-Type

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'conexion.php'; // DB

$data = json_decode(file_get_contents("php://input")); // Lee el cuerpo de la petición y lo convierte de JSON a un objeto de PHP

if(isset($data->nombre_torneo)) { // Si el objeto recibido contiene la propiedad del nombre del torneo ->

    $result = $conn->query("SELECT COALESCE(MAX(id_torneo), 0) + 1 AS next_id FROM Torneo"); // Busca el ID más alto existente en la tabla y le suma uno para el nuevo registro
    $row = $result->fetch_assoc(); // Extrae el resultado de la consulta como un diccionario
    $next_id = $row['next_id']; // Guarda el nuevo ID calculado en una variable

    $stmt = $conn->prepare("INSERT INTO Torneo (id_torneo, nombre_torneo, torneo_inicio, torneo_fin, max_equipos, formato_torneo, categoria_torneo, deporte_torneo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"); // Prepara la consulta de inserción segura con espacios en blanco para los valores

    $stmt->bind_param("isssisss",
                      $next_id,
                      $data->nombre_torneo,
                      $data->torneo_inicio,
                      $data->torneo_fin,
                      $data->max_equipos,
                      $data->formato_torneo,
                      $data->categoria_torneo,
                      $data->deporte_torneo
    ); // Reemplaza los espacios en blanco con las variables reales indicando sus tipos de datos

    if($stmt->execute()) { // Si la inserción en la base de datos se ejecuta correctamente ->
        echo json_encode(["status" => "success", "mensaje" => "Torneo creado correctamente con el ID: " . $next_id]); // Responde con un JSON indicando éxito y mostrando el ID generado
    } else { // Si ocurrió un error al intentar insertar ->
        echo json_encode(["status" => "error", "mensaje" => "Error de MySQL: " . $stmt->error]); // Responde con un JSON indicando el error exacto devuelto por MySQL
    }

    $stmt->close(); // Libera los recursos de la consulta preparada
} else { // Si no se recibió el nombre del torneo en la petición ->
    echo json_encode(["status" => "error", "mensaje" => "Datos del torneo incompletos."]); // Responde con un JSON indicando que faltan datos
}

$conn->close(); // Cierra la conexión con la base de datos
// RESUMEN: Recibe los datos de un nuevo torneo desde la interfaz, calcula automáticamente el siguiente ID disponible y guarda el registro en la base de datos
?>
