<?php
namespace Olympia\Repositories;

use Olympia\Domain\Equipo;
use PDO;
use Exception;

/**
 * Clase EquipoRepository
 * Encargada de la persistencia y recuperación de datos de la entidad Equipo usando Procedimientos Almacenados.
 */
class EquipoRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Busca un equipo por su ID.
     */
    public function find(int $id_equipo): ?Equipo {
        $stmt = $this->db->prepare("CALL sp_BuscarEquipoPorId(:id)");
        $stmt->execute(['id' => $id_equipo]);
        $row = $stmt->fetch();
        $stmt->closeCursor();

        if (!$row) {
            return null;
        }

        return new Equipo(
            $row['nombre_equipo'],
            $row['descripcion_equipo'],
            $row['categoria_equipo'],
            $row['deporte_equipo'],
            (int)$row['id_equipo']
        );
    }

    /**
     * Busca todos los equipos del sistema.
     */
    public function findAll(): array {
        $stmt = $this->db->query("CALL sp_ListarEquiposConDisciplina()");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $equipos = [];
        foreach ($rows as $row) {
            $equipos[] = new Equipo(
                $row['nombre_equipo'],
                $row['descripcion_equipo'],
                $row['categoria_equipo'],
                $row['deporte_equipo'],
                (int)$row['id_equipo']
            );
        }

        return $equipos;
    }

    /**
     * Obtiene todos los equipos asignados a un torneo.
     */
    public function findByTorneo(int $id_torneo): array {
        $stmt = $this->db->prepare("CALL sp_BuscarEquiposPorTorneo(:id_torneo)");
        $stmt->execute(['id_torneo' => $id_torneo]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $equipos = [];
        foreach ($rows as $row) {
            $equipos[] = new Equipo(
                $row['nombre_equipo'],
                $row['descripcion_equipo'],
                $row['categoria_equipo'],
                $row['deporte_equipo'],
                (int)$row['id_equipo']
            );
        }

        return $equipos;
    }

    /**
     * Obtiene los equipos disponibles de la misma disciplina del torneo que no están inscriptos aún.
     */
    public function findAvailableForTorneo(int $id_torneo): array {
        $stmt = $this->db->prepare("CALL sp_BuscarEquiposDisponiblesParaTorneo(:id_torneo)");
        $stmt->execute(['id_torneo' => $id_torneo]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $equipos = [];
        foreach ($rows as $row) {
            $equipos[] = new Equipo(
                $row['nombre_equipo'],
                $row['descripcion_equipo'],
                $row['categoria_equipo'],
                $row['deporte_equipo'],
                (int)$row['id_equipo']
            );
        }

        return $equipos;
    }

    /**
     * Guarda (inserta o actualiza) un equipo en base de datos.
     */
    public function save(Equipo $equipo): bool {
        $stmt = $this->db->prepare("CALL sp_GuardarEquipo(:id, :nombre, :descripcion, :deporte, :categoria, @id_generado, @resultado, @mensaje)");
        $stmt->bindValue(':id', $equipo->id_equipo, PDO::PARAM_INT);
        $stmt->bindValue(':nombre', $equipo->nombre_equipo);
        $stmt->bindValue(':descripcion', $equipo->descripcion_equipo);
        $stmt->bindValue(':deporte', $equipo->deporte_equipo);
        $stmt->bindValue(':categoria', $equipo->categoria_equipo);

        $stmt->execute();
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @id_generado AS id_generado, @resultado AS resultado, @mensaje AS mensaje")->fetch();

        if (!$res || !$res['resultado']) {
            return false;
        }

        // Actualizar el ID en el objeto si fue generado
        if ($equipo->id_equipo === null && isset($res['id_generado'])) {
            $equipo->id_equipo = (int)$res['id_generado'];
        }

        return true;
    }

    /**
     * Asocia un equipo a un torneo en la tabla Torneo_equipo.
     */
    public function inscribirEnTorneo(int $id_equipo, int $id_torneo): bool {
        $stmt = $this->db->prepare("CALL sp_InscribirEquipoEnTorneo(:id_equipo, :id_torneo, @resultado, @mensaje)");
        $stmt->execute([
            'id_equipo' => $id_equipo,
            'id_torneo' => $id_torneo
        ]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }

    /**
     * Remueve un equipo de un torneo en la tabla Torneo_equipo.
     */
    public function desinscribirDeTorneo(int $id_equipo, int $id_torneo): bool {
        $stmt = $this->db->prepare("CALL sp_DesinscribirEquipoDeTorneo(:id_equipo, :id_torneo, @resultado, @mensaje)");
        $stmt->execute([
            'id_equipo' => $id_equipo,
            'id_torneo' => $id_torneo
        ]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }

    /**
     * Remueve todos los equipos inscriptos de un torneo específico.
     */
    public function eliminarInscripcionesTorneo(int $id_torneo): bool {
        $stmt = $this->db->prepare("CALL sp_EliminarInscripcionesTorneo(:id_torneo, @resultado, @mensaje)");
        $stmt->execute(['id_torneo' => $id_torneo]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }

    /**
     * Obtiene la cantidad de jugadores asociados a la plantilla de un equipo.
     */
    public function obtenerCantidadJugadores(int $id_equipo): int {
        $stmt = $this->db->prepare("CALL sp_ObtenerCantidadJugadores(:id_equipo, @total)");
        $stmt->execute(['id_equipo' => $id_equipo]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @total AS total")->fetch();
        return (int)($res['total'] ?? 0);
    }
}
