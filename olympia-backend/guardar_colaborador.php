<?php
header("Access-Control-Allow-Origin: *"); // CORS
header("Access-Control-Allow-Methods: POST, OPTIONS"); // CORS Métodos
header("Access-Control-Allow-Headers: Content-Type"); // CORS Cabeceras

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); } // Si es una petición de prueba del navegador, la aprueba y corta ahí

require 'conexion.php'; // BD
$data = json_decode(file_get_contents("php://input")); // Lee datos

if(isset($data->dni) && isset($data->rol)) { // Se asegura de que venga el DNI y el ID del rol

    // Primero revisa si esa persona realmente existe en la base de datos de Usuarios
    $stmtCheck = $conn->prepare("SELECT nombre_usuario, apellido_usuario FROM Usuario WHERE dni_usuario = ?");
    $stmtCheck->bind_param("i", $data->dni);
    $stmtCheck->execute();
    $resultado = $stmtCheck->get_result();

    if($resultado->num_rows === 0) { // Si no existe ->
        echo json_encode(["status" => "error", "mensaje" => "El DNI ingresado no está registrado. Por favor, registre al usuario primero."]); // Avisa del error
        exit; // Corta la ejecución
    }

    $usuarioEncontrado = $resultado->fetch_assoc(); // Extrae los datos del usuario
    $nombreCompleto = $usuarioEncontrado['nombre_usuario'] . ' ' . $usuarioEncontrado['apellido_usuario']; // Arma el nombre para el mensaje
    $stmtCheck->close(); // Cierra esta consulta

    try {
        // Vincula al usuario con su nuevo rol en la tabla puente
        $stmtRol = $conn->prepare("INSERT INTO Usuario_rol (id_rol, dni_usuario) VALUES (?, ?)");
        $stmtRol->bind_param("ii", $data->rol, $data->dni);
        $stmtRol->execute();

        echo json_encode(["status" => "success", "mensaje" => "Rol asignado exitosamente a $nombreCompleto."]); // Éxito

    } catch (Exception $e) { // Si falla (generalmente pasa si ya tenía ese rol y la base de datos lo bloquea por duplicado) ->
        echo json_encode(["status" => "error", "mensaje" => "Error al asignar rol. Es posible que el usuario ya tenga este rol."]);
    }
} else { // Si faltó DNI o Rol ->
    echo json_encode(["status" => "error", "mensaje" => "DNI o Rol no proporcionados."]); // Mensaje de error
}
$conn->close(); // Cierra BD
// RESUMEN: Le asigna un nuevo cargo/rol a un usuario existente buscando su DNI
?>
