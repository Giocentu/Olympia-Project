<?php
header("Access-Control-Allow-Origin: *"); // Permite la conexión desde React
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Acepta peticiones para guardar datos y verificar conexión
header("Access-Control-Allow-Headers: Content-Type"); // Acepta el formato de los datos enviados

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); } // Si es una petición de prueba del navegador, la aprueba y corta ahí

require 'conexion.php'; // Se conecta a la base de datos

$data = json_decode(file_get_contents("php://input")); // Lee los datos enviados por React y los convierte a un formato manejable en PHP

if(isset($data->dniJugador)) { // Verifica si realmente enviaron un DNI. Si no, no hace nada

    $nombreFormateado = trim($data->nombre); // Le quita los espacios en blanco al principio y final del nombre

    // Prepara la consulta SQL dejando huecos (?) para mayor seguridad (evita hackeos por inyección SQL)
    $stmt = $conn->prepare("INSERT INTO Usuario (dni_usuario, nombre_usuario, apellido_usuario, fecha_nac, email, telefono_usuario) VALUES (?, ?, ?, ?, ?, ?)");

    // Rellena los huecos (?) con los datos reales. La 'i' es para número (DNI) y las 's' para texto
    $stmt->bind_param("isssss", $data->dniJugador, $nombreFormateado, $data->apellido, $data->fechaNacimiento, $data->correoElectronico, $data->telefono);

    if($stmt->execute()) { // Ejecuta la orden. Si sale bien ->
        echo json_encode(["status" => "success", "mensaje" => "Jugador insertado como Usuario. (Luego podrás asignarlo a un equipo)"]); // Responde éxito a React
    } else { // Si falla ->
        echo json_encode(["status" => "error", "mensaje" => "Error al guardar en la base de datos: " . $stmt->error]); // Responde con el error exacto
    }
    $stmt->close(); // Cierra el proceso de la consulta
} else { // Si nunca enviaron el DNI ->
    echo json_encode(["status" => "error", "mensaje" => "Error: No se recibió el DNI del jugador."]); // Manda mensaje de error
}
$conn->close(); // Cierra la conexión con la base de datos
//RESUMEN: Recibe los datos de un jugador desde la interfaz y lo registra como un usuario nuevo en la base de datos
?>
