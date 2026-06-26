<?php
namespace Olympia\Repositories;

use Olympia\Domain\Solicitud;
use PDO;
use Exception;

/**
 * Clase SolicitudRepository
 * Proporciona el mapeo de persistencia SQL para las solicitudes de inscripción usando Procedimientos Almacenados.
 */
class SolicitudRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Busca una solicitud por su ID.
     */
    public function find(string $id_solicitud): ?Solicitud {
        $stmt = $this->db->prepare("CALL sp_BuscarSolicitudPorId(:id)");
        $stmt->execute(['id' => $id_solicitud]);
        $row = $stmt->fetch();
        $stmt->closeCursor();

        if (!$row) {
            return null;
        }

        return new Solicitud(
            (int)$row['id_torneo'],
            (int)$row['id_equipo'],
            $row['estado_solicitud'],
            $row['fecha_solicitud'],
            $row['id_solicitud']
        );
    }

    /**
     * Recupera todas las solicitudes del sistema con información de equipo y torneo.
     */
    public function findAll(): array {
        $stmt = $this->db->query("CALL sp_ListarSolicitudes()");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $solicitudes = [];
        foreach ($rows as $row) {
            $sol = new Solicitud(
                (int)$row['id_torneo'],
                (int)$row['id_equipo'],
                $row['estado_solicitud'],
                $row['fecha_solicitud'],
                $row['id_solicitud']
            );
            $sol->nombre_torneo = $row['nombre_torneo'];
            $sol->nombre_equipo = $row['nombre_equipo'];
            $sol->deporte_torneo = $row['deporte_torneo'];
            $solicitudes[] = $sol;
        }

        return $solicitudes;
    }

    /**
     * Guarda una solicitud en la base de datos.
     */
    public function save(Solicitud $solicitud): bool {
        if ($solicitud->id_solicitud === null) {
            $solicitud->id_solicitud = 'sol_' . round(microtime(true) * 1000);
        }

        $stmt = $this->db->prepare("CALL sp_GuardarSolicitud(:id, :id_torneo, :id_equipo, :estado, :fecha, @resultado, @mensaje)");
        $stmt->execute([
            'id' => $solicitud->id_solicitud,
            'id_torneo' => $solicitud->id_torneo,
            'id_equipo' => $solicitud->id_equipo,
            'estado' => $solicitud->estado_solicitud,
            'fecha' => $solicitud->fecha_solicitud
        ]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }

    /**
     * Actualiza el estado de una solicitud.
     */
    public function updateEstado(string $id_solicitud, string $estado): bool {
        $stmt = $this->db->prepare("CALL sp_ActualizarEstadoSolicitud(:id, :estado, @resultado, @mensaje)");
        $stmt->execute([
            'id' => $id_solicitud,
            'estado' => $estado
        ]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }

    /**
     * Verifica si ya existe una solicitud activa (Pendiente o Aprobada) para el binomio equipo/torneo.
     */
    public function checkDuplicada(int $id_equipo, int $id_torneo): bool {
        $stmt = $this->db->prepare("CALL sp_CheckSolicitudDuplicada(:id_equipo, :id_torneo, @duplicado)");
        $stmt->execute([
            'id_equipo' => $id_equipo,
            'id_torneo' => $id_torneo
        ]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @duplicado AS duplicado")->fetch();
        return (bool)($res['duplicado'] ?? false);
    }

    /**
     * Recupera las solicitudes de inscripción para los torneos a los que un organizador está asignado.
     */
    public function findAllByOrganizador(int $dni_organizador): array {
        $stmt = $this->db->prepare("CALL sp_ListarSolicitudesPorOrganizador(:dni)");
        $stmt->execute(['dni' => $dni_organizador]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $solicitudes = [];
        foreach ($rows as $row) {
            $sol = new Solicitud(
                (int)$row['id_torneo'],
                (int)$row['id_equipo'],
                $row['estado_solicitud'],
                $row['fecha_solicitud'],
                $row['id_solicitud']
            );
            $sol->nombre_torneo = $row['nombre_torneo'];
            $sol->nombre_equipo = $row['nombre_equipo'];
            $sol->deporte_torneo = $row['deporte_torneo'];
            $solicitudes[] = $sol;
        }

        return $solicitudes;
    }
}
