<?php
// Requerimos la conexión que creamos antes
require 'conexion.php';

// Leemos los datos que nos envía React
$datos_react = json_decode(file_get_contents("php://input"));

if($datos_react) {
    // IMPORTANTE: Estos nombres deben coincidir con lo que envía React
    $nombre = $datos_react->nombre_torneo;
    $inicio = $datos_react->torneo_inicio;
    $fin = $datos_react->torneo_fin;
    $id_cat = $datos_react->id_categoria;
    $id_form = $datos_react->id_formato;
    $id_dep = $datos_react->id_deporte;

    try {
        // Preparamos la consulta SQL
        $sql = "INSERT INTO Torneo (id_torneo, nombre_torneo, torneo_inicio, torneo_fin, max_equipos, id_categoria, id_formato, id_deporte)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conexion->prepare($sql);
        // El primer valor es un ID aleatorio temporal para id_torneo
        $stmt->execute([rand(1,10000), $nombre, $inicio, $fin, 16, $id_cat, $id_form, $id_dep]);

        echo json_encode(["status" => "success", "mensaje" => "Torneo guardado correctamente"]);
    } catch(PDOException $e) {
        echo json_encode(["status" => "error", "mensaje" => $e->getMessage()]);
    }
}
?>
