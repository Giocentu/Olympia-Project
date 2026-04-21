<?php
header("Access-Control-Allow-Origin: *"); // Permite que cualquier origen acceda a este archivo
header("Content-Type: application/json; charset=UTF-8"); // Indica que la respuesta será en formato JSON

require 'conexion.php'; // Importa el archivo de conexión a la base de datos

$sql = "SELECT id_torneo, nombre_torneo, deporte_torneo, categoria_torneo FROM Torneo ORDER BY torneo_inicio DESC"; // Prepara la consulta SQL para obtener los torneos ordenados por fecha más reciente
$result = $conn->query($sql); // Ejecuta la consulta en la base de datos

$torneos = array(); // Crea un arreglo vacío para almacenar los resultados

if ($result && $result->num_rows > 0) { // Si la consulta fue exitosa y hay al menos un torneo encontrado ->

    while($row = $result->fetch_assoc()) { // Extrae cada fila de resultados como un diccionario iterando una por una
        $torneos[] = $row; // Añade el diccionario del torneo actual al arreglo general
    }

    echo json_encode($torneos); // Convierte el arreglo a JSON y lo envía como respuesta
} else { // Si no se encontraron torneos o hubo un error ->
    echo json_encode([]); // Envía un arreglo JSON vacío para evitar errores en el cliente
}

$conn->close(); // Cierra la conexión con la base de datos
//RESUMEN: Este archivo consulta la base de datos para obtener una lista de todos los torneos registrados, ordenándolos desde el más reciente hasta el más antiguo, y los devuelve en formato JSON
?>
