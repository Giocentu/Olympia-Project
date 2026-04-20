<?php
// Solo asigna roles
// ============================================================================
// 1. CONFIGURACIÓN DE SEGURIDAD (CORS)
// ============================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'conexion.php';
$data = json_decode(file_get_contents("php://input"));

// Solo necesitamos el DNI y el Rol que se le va a asignar
if(isset($data->dni) && isset($data->rol)) {

    // ============================================================================
    // 2. VERIFICAR SI EL USUARIO EXISTE
    // ============================================================================
    // Buscamos si el DNI ya está registrado en la tabla base 'Usuario'
    $stmtCheck = $conn->prepare("SELECT nombre_usuario, apellido_usuario FROM Usuario WHERE dni_usuario = ?");
    $stmtCheck->bind_param("i", $data->dni);
    $stmtCheck->execute();
    $resultado = $stmtCheck->get_result();

    if($resultado->num_rows === 0) {
        // El usuario NO existe. Detenemos la ejecución y mandamos un error.
        echo json_encode([
            "status" => "error",
            "mensaje" => "El DNI ingresado no está registrado. Por favor, registre al usuario primero."
        ]);
        exit; // Cortamos el proceso aquí
    }

    // Si llegó hasta aquí, el usuario existe. Obtenemos su nombre para un mensaje bonito.
    $usuarioEncontrado = $resultado->fetch_assoc();
    $nombreCompleto = $usuarioEncontrado['nombre_usuario'] . ' ' . $usuarioEncontrado['apellido_usuario'];
    $stmtCheck->close();

    // ============================================================================
    // 3. ASIGNAR EL ROL AL USUARIO
    // ============================================================================
    try {
        // Insertamos en la tabla intermedia Usuario_rol
        $stmtRol = $conn->prepare("INSERT INTO Usuario_rol (id_rol, dni_usuario) VALUES (?, ?)");
        $stmtRol->bind_param("ii", $data->rol, $data->dni);
        $stmtRol->execute();

        echo json_encode([
            "status" => "success",
            "mensaje" => "Rol asignado exitosamente a $nombreCompleto."
        ]);

    } catch (Exception $e) {
        // Si falla (ej. el usuario ya tenía ese rol asignado y la llave primaria salta)
        echo json_encode([
            "status" => "error",
            "mensaje" => "Error al asignar rol. Es posible que el usuario ya tenga este rol."
        ]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "DNI o Rol no proporcionados."]);
}
$conn->close();
?>
