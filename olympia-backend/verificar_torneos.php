<?php
// ============================================================================
// 1. CONFIGURACIÓN CORS Y TIPO DE RESPUESTA
// ============================================================================
header("Access-Control-Allow-Origin: *");
// Aquí le decimos explícitamente al navegador que lo que vamos a imprimir es un JSON puro.
header("Content-Type: application/json; charset=UTF-8");

require 'conexion.php';

// ============================================================================
// 2. PREPARACIÓN Y EJECUCIÓN DE LA CONSULTA
// ============================================================================
// Queremos traer los torneos ordenados por su fecha de inicio (los más recientes arriba).
$sql = "SELECT id_torneo, nombre_torneo, deporte_torneo, categoria_torneo FROM Torneo ORDER BY torneo_inicio DESC";
$result = $conn->query($sql);

// Creamos un array vacío donde iremos guardando los torneos que encontremos.
$torneos = array();

// ============================================================================
// 3. EMPAQUETADO DE RESULTADOS
// ============================================================================
// Verificamos si la consulta se ejecutó bien y si encontró al menos 1 torneo (> 0).
if ($result && $result->num_rows > 0) {

    // fetch_assoc() agarra una fila de la base de datos y la convierte en un diccionario.
    // El 'while' hace que este proceso se repita fila por fila hasta que no queden más.
    while($row = $result->fetch_assoc()) {
        // Metemos cada diccionario (torneo) dentro de nuestro array principal.
        $torneos[] = $row;
    }

    // Imprimimos el array convertido a JSON. Esto es lo que lee React.
    echo json_encode($torneos);
} else {
    // Si no hay torneos, devolvemos un array vacío []. Así React no se crashea.
    echo json_encode([]);
}

$conn->close();
?>
