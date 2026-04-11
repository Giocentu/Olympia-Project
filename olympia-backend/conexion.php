<?php
// Permitir que React (que corre en otro puerto) se comunique con PHP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Credenciales de tu base de datos local (XAMPP por defecto)
$host = "localhost";
$usuario = "root";
$password = ""; // En XAMPP suele estar vacío
$base_datos = "db_olympia"; // El nombre que pusiste en tu script SQL

try {
    // Usamos PDO por seguridad (evita inyecciones SQL)
    $conexion = new PDO("mysql:host=$host;dbname=$base_datos;charset=utf8", $usuario, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Conectado exitosamente"; // Descomentar solo para probar
} catch(PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    die();
}
?>
