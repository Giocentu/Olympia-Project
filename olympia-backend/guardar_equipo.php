<?php
// ============================================================================
// 1. CONFIGURACIÓN DE SEGURIDAD
// ============================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

require 'conexion.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->nombre_equipo)) {
    // ============================================================================
    // 2. INICIO DE TRANSACCIÓN
    // ============================================================================
    // Como tenemos que insertar en la tabla Equipo y  en Torneo_equipo,
    // si la primera funciona pero la segunda falla, la transacción deshace la primera
    // para evitar datos corruptos o "huerfanos" en la base de datos.
    $conn->begin_transaction();

    try {
        // A. Calculamos el ID manual para el nuevo equipo.
        $result = $conn->query("SELECT COALESCE(MAX(id_equipo), 0) + 1 AS next_id FROM Equipo");
        $row = $result->fetch_assoc();
        $next_id = $row['next_id'];

        // B. Insertamos los datos principales en la tabla Equipo.
        $stmt = $conn->prepare("INSERT INTO Equipo (id_equipo, nombre_equipo, descripcion_equipo, categoria_equipo, deporte_equipo) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $next_id, $data->nombre_equipo, $data->descripcion_equipo, $data->categoria_equipo, $data->deporte_equipo);
        $stmt->execute();

        // C. Verificamos si desde React enviaron un ID de Torneo para vincularlo de inmediato.
        // !empty significa "Si no está vacío..."
        if(!empty($data->id_torneo)) {
            // Insertamos la relación en la tabla intermedia Torneo_equipo.
            $stmtTorneo = $conn->prepare("INSERT INTO Torneo_equipo (id_torneo, id_equipo) VALUES (?, ?)");
            // Ambos son enteros (id_torneo, id_equipo), por eso usamos "ii".
            $stmtTorneo->bind_param("ii", $data->id_torneo, $next_id);
            $stmtTorneo->execute();
            $stmtTorneo->close();
        }

        // ============================================================================
        // 3. CONFIRMACIÓN (COMMIT)
        // ============================================================================
        // Si el código llegó hasta aquí sin dar errores, guardamos los cambios definitivamente.
        $conn->commit();
        echo json_encode(["status" => "success", "mensaje" => "Equipo registrado exitosamente"]);

    } catch (Exception $e) {
        // ============================================================================
        // 4. REVERSIÓN EN CASO DE ERROR (ROLLBACK)
        // ============================================================================
        // Si cualquier execute() falla, caemos aquí. Deshacemos todo lo que intentamos
        // guardar en este archivo y le avisamos a React del error.
        $conn->rollback();
        echo json_encode(["status" => "error", "mensaje" => "Fallo en la transacción: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "Faltan datos obligatorios del equipo"]);
}
$conn->close();
?>
