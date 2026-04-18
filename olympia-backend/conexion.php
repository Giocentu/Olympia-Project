<?php
// ============================================================================
// ARCHIVO CENTRAL DE CONEXIÓN A LA BASE DE DATOS
// ============================================================================

// 1. CREDENCIALES DE ACCESO
$host = "localhost"; // Dónde está la base de datos
$user = "root";      // El usuario por defecto de phpMyAdmin
$pass = "";          // La contraseña (vacía por defecto en XAMPP)
$dbname = "db_olympia"; // Nombre exacto de la base de datos

// 2. CREACIÓN DE CONEXIÓN
// Usamos la clase mysqli de PHP para intentar abrir la puerta a la base de datos.
$conn = new mysqli($host, $user, $pass, $dbname);

// 3. VERIFICACIÓN DE ERRORES
// Si 'connect_error' tiene algo, significa que la puerta no se abrió.
if ($conn->connect_error) {
    // Matamos el proceso (die) y enviamos un JSON de error para que React sepa qué falló.
    die(json_encode([
        "status" => "error",
        "mensaje" => "Fallo la conexión a la Base de Datos: " . $conn->connect_error
    ]));
}

// 4. CONFIGURACIÓN DE CARACTERES (Súper importante para el español)
// Le decimos a MySQL que nos vamos a comunicar en UTF-8.
// Esto evita que las 'ñ' o los acentos ('á', 'é') se guarden como símbolos raros (ej: 'NiÃ±o').
$conn->set_charset("utf8");
?>
