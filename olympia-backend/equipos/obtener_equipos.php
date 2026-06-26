<?php
/**
 * obtener_equipos.php
 * Endpoint raíz. Delega la obtención de todos los equipos al controlador EquipoController.
 */
require_once __DIR__ . '/../src/bootstrap.php';

$controller = new \Olympia\Controllers\EquipoController();
$controller->obtenerTodosLosEquipos();
