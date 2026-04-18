<?php
// ============================================================================
// 1. CONFIGURACIÓN DE SEGURIDAD Y CABECERAS (CORS)
// ============================================================================
// React y PHP suelen correr en "puertos" distintos (ej: React en 5173 y PHP en 80).
// Por defecto, los navegadores bloquean la comunicación entre puertos diferentes por seguridad.
// Estas tres líneas le dicen al navegador: "Confía en mí".
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Antes de enviar los datos reales, el navegador a veces manda una petición "fantasma"
// llamada OPTIONS para ver si el servidor está vivo y permite la conexión.
// Si es así, cortamos la ejecución aquí mismo dándole luz verde.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// ============================================================================
// 2. CONEXIÓN A LA BASE DE DATOS
// ============================================================================
require 'conexion.php';


// ============================================================================
// 3. RECEPCIÓN DE DATOS DESDE REACT
// ============================================================================
// React envía la información empaquetada en un formato llamado JSON.
// file_get_contents("php://input") atrapa ese paquete, y json_decode lo "desempaqueta"
// convirtiéndolo en un objeto de PHP ($data) que podemos manipular fácilmente.
$data = json_decode(file_get_contents("php://input"));

// Comprobamos de manera segura si nos llegó el DNI. Si no hay DNI, no hacemos nada.
if(isset($data->dniJugador)) {

    // ============================================================================
    // 4. PREPARACIÓN Y LIMPIEZA DE DATOS
    // ============================================================================
    // En el React tenemos "primerNombre" y "segundoNombre", pero en la base de datos
    // solo tienes un campo llamado "nombre_usuario".
    // Lo que hacemos aquí es unirlos. El operador '??' significa: "si el segundo nombre
    // no existe, entonces pon un texto vacío".
    // La función trim() quita los espacios en blanco sobrantes al principio y al final.
    $nombreFormateado = trim($data->primerNombre . ' ' . ($data->segundoNombre ?? ''));

    // ============================================================================
    // 5. INSERCIÓN EN LA BASE DE DATOS
    // ============================================================================
    // NUNCA debemos poner las variables directamente en la consulta SQL por seguridad
    // (para evitar que nos hackeen con Inyección SQL). En su lugar, ponemos signos de
    // interrogación (?) como marcadores de posición.
    $stmt = $conn->prepare("INSERT INTO Usuario (dni_usuario, nombre_usuario, apellido_usuario, fecha_nac, email, telefono_usuario) VALUES (?, ?, ?, ?, ?, ?)");

    // Ahora "vinculamos" los datos de React a esos marcadores (?).
    // El texto "isssss" es un mapa de tipos de datos para la base de datos:
    // i = integer (número entero, para el DNI)
    // s = string (texto)
    $stmt->bind_param("isssss",
                      $data->dniJugador,
                      $nombreFormateado,
                      $data->apellido,
                      $data->fechaNacimiento,
                      $data->correoElectronico,
                      $data->telefono
    );

    // ============================================================================
    // 6. EJECUCIÓN Y RESPUESTA A REACT
    // ============================================================================
    // Mandamos la orden a ejecutar. Si la base de datos dice "OK":
    if($stmt->execute()) {
        // Le respondemos a React con un JSON de éxito. React leerá "status" === "success"
        echo json_encode([
            "status" => "success",
            "mensaje" => "Jugador insertado como Usuario. (Luego podrás asignarlo a un equipo)"
        ]);
    } else {
        // Si falla
        // capturamos el error exacto de MySQL ($stmt->error) y se lo mandamos a React.
        echo json_encode([
            "status" => "error",
            "mensaje" => "Error al guardar en la base de datos: " . $stmt->error
        ]);
    }

    $stmt->close();

} else {
    // Si alguien intenta acceder a este PHP directamente desde la URL del navegador
    // o sin enviar un DNI, caerá aquí.
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error: No se recibió el DNI del jugador."
    ]);
}

// Finalmente, cerramos la conexión con la base de datos.
$conn->close();
?>
