<?php
header("Access-Control-Allow-Origin: *"); // Permite que cualquier origen acceda a este archivo
header("Content-Type: application/json"); // Indica que la respuesta será estrictamente en formato JSON

require 'conexion.php'; // Importa el archivo de conexión a la base de datos

try { // Inicia un bloque de código que atrapará posibles errores de ejecución
    $stmt = $conexion->query("SELECT id_deporte, nombre_deporte FROM Deporte"); // Ejecuta una consulta para obtener todos los deportes disponibles
    $deportes = $stmt->fetchAll(PDO::FETCH_ASSOC); // Extrae todas las filas encontradas como un arreglo de diccionarios usando PDO

    echo json_encode($deportes); // Convierte el arreglo de deportes a JSON y lo envía como respuesta
} catch(PDOException $e) { // Si ocurre un error relacionado con la base de datos en el bloque anterior ->
    echo json_encode(["error" => $e->getMessage()]); // Responde con un JSON que contiene el mensaje de error capturado
}
?>
