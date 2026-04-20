<?php
// ============================================================================
// 1. CONFIGURACIÓN DE SEGURIDAD Y CABECERAS (CORS)
// ============================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Permitimos la petición "fantasma" de los navegadores.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

// ============================================================================
// 2. CONEXIÓN A LA BASE DE DATOS
// ============================================================================
require 'conexion.php';

// ============================================================================
// 3. RECEPCIÓN DE DATOS DESDE REACT
// ============================================================================
$data = json_decode(file_get_contents("php://input"));

// Verificamos que al menos nos hayan enviado el nombre del torneo
if(isset($data->nombre_torneo)) {

    // ============================================================================
    // 4. CÁLCULO DEL ID MANUAL
    // ============================================================================
    // Le pedimos a MySQL: "Busca el número de ID más alto en la tabla Torneo".
    // COALESCE hace que si la tabla está vacía (devuelve NULL), asuma un 0.
    // Luego le sumamos 1. Así, si el último era el 5, el nuevo será el 6.
    $result = $conn->query("SELECT COALESCE(MAX(id_torneo), 0) + 1 AS next_id FROM Torneo");
    $row = $result->fetch_assoc();
    $next_id = $row['next_id']; // Aquí guardamos nuestro nuevo ID calculado.

    // ============================================================================
    // 5. PREPARACIÓN DE LA CONSULTA SQL
    // ============================================================================
    $stmt = $conn->prepare("INSERT INTO Torneo (id_torneo, nombre_torneo, torneo_inicio, torneo_fin, max_equipos, formato_torneo, categoria_torneo, deporte_torneo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    // Vinculamos los datos. Mapa:
    // i = integer (id_torneo), s = string (nombre), s = string (inicio), s = string (fin)
    // i = integer (max_equipos), s = string (formato), s = string (categoria), s = string (deporte)
    $stmt->bind_param("isssisss",
                      $next_id,
                      $data->nombre_torneo,
                      $data->torneo_inicio,
                      $data->torneo_fin,
                      $data->max_equipos,
                      $data->formato_torneo,
                      $data->categoria_torneo,
                      $data->deporte_torneo
    );

    // ============================================================================
    // 6. EJECUCIÓN Y RESPUESTA
    // ============================================================================
    if($stmt->execute()) {
        echo json_encode(["status" => "success", "mensaje" => "Torneo creado correctamente con el ID: " . $next_id]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error de MySQL: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "mensaje" => "Datos del torneo incompletos."]);
}

$conn->close();
