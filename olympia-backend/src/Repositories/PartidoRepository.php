<?php
namespace Olympia\Repositories;

use Olympia\Domain\Partido;
use PDO;
use Exception;

/**
 * Clase PartidoRepository
 * Encargada de la persistencia y recuperación de datos de la entidad Partido usando Procedimientos Almacenados.
 */
class PartidoRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Busca un partido por su ID reconstructurándolo desde las tablas normalizadas.
     */
    public function find(int $id_partido): ?Partido {
        $stmt = $this->db->prepare("CALL sp_BuscarPartidoPorId(:id)");
        $stmt->execute(['id' => $id_partido]);
        $row = $stmt->fetch();
        $stmt->closeCursor();

        if (!$row) {
            return null;
        }

        // Recuperar local y visitante desde Resultado_partido usando stored procedure
        $stmtRes = $this->db->prepare("CALL sp_BuscarResultadosPartido(:id)");
        $stmtRes->execute(['id' => $id_partido]);
        $results = $stmtRes->fetchAll(PDO::FETCH_ASSOC);
        $stmtRes->closeCursor();

        $idLocal = null;
        $idVisitante = null;
        $scoreLocal = 0;
        $scoreVisitante = 0;

        foreach ($results as $resRow) {
            if ($resRow['condicion'] === 'Local') {
                $idLocal = (int)$resRow['id_equipo'];
                $scoreLocal = (int)$resRow['puntuacion'];
            } elseif ($resRow['condicion'] === 'Visitante') {
                $idVisitante = (int)$resRow['id_equipo'];
                $scoreVisitante = (int)$resRow['puntuacion'];
            }
        }

        return new Partido(
            $row['estado_partido'],
            $row['fecha_partido'],
            (int)$row['id_torneo'],
            $row['fase_jornada'],
            $idLocal,
            $idVisitante,
            $scoreLocal,
            $scoreVisitante,
            (int)$row['id_partido']
        );
    }

    /**
     * Recupera el fixture completo de un torneo usando un SP optimizado con JOINs.
     */
    public function findByTorneo(int $id_torneo): array {
        $stmt = $this->db->prepare("CALL sp_BuscarPartidosPorTorneo(:id_torneo)");
        $stmt->execute(['id_torneo' => $id_torneo]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();

        $partidos = [];
        foreach ($rows as $row) {
            $partido = new Partido(
                $row['estado_partido'],
                $row['fecha_partido'],
                (int)$row['id_torneo'],
                $row['fase_jornada'],
                $row['id_equipo_local'] !== null ? (int)$row['id_equipo_local'] : null,
                $row['id_equipo_visitante'] !== null ? (int)$row['id_equipo_visitante'] : null,
                (int)($row['marcador_local'] ?? 0),
                (int)($row['marcador_visitante'] ?? 0),
                (int)$row['id_partido']
            );
            $partido->equipo_local_nombre = $row['equipo_local_nombre'] ?? 'Libre';
            $partido->equipo_visitante_nombre = $row['equipo_visitante_nombre'] ?? 'Libre';
            $partidos[] = $partido;
        }

        return $partidos;
    }

    /**
     * Elimina todos los partidos y puntuaciones de un torneo.
     */
    public function deleteByTorneo(int $id_torneo): bool {
        $stmt = $this->db->prepare("CALL sp_LimpiarPartidosTorneo(:id_torneo, @resultado, @mensaje)");
        $stmt->execute(['id_torneo' => $id_torneo]);
        $stmt->closeCursor();

        $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
        return (bool)($res['resultado'] ?? false);
    }

    /**
     * Guarda un partido e inserta/actualiza sus dos filas en Resultado_partido.
     */
    public function save(Partido $partido): bool {
        $startedTransaction = false;
        if (!$this->db->inTransaction()) {
            $this->db->beginTransaction();
            $startedTransaction = true;
        }

        try {
            $stmt = $this->db->prepare("CALL sp_GuardarPartido(:id, :id_torneo, :estado, :fecha, :fase, :id_local, :id_vis, :pts_local, :pts_vis, :cond_local, :cond_vis, @id_generado, @resultado, @mensaje)");

            $stmt->bindValue(':id', $partido->id_partido, PDO::PARAM_INT);
            $stmt->bindValue(':id_torneo', $partido->id_torneo, PDO::PARAM_INT);
            $stmt->bindValue(':estado', $partido->estado_partido);
            $stmt->bindValue(':fecha', $partido->fecha_partido);
            $stmt->bindValue(':fase', $partido->fase_jornada);
            $stmt->bindValue(':id_local', $partido->id_equipo_local, PDO::PARAM_INT);
            $stmt->bindValue(':id_vis', $partido->id_equipo_visitante, PDO::PARAM_INT);
            $stmt->bindValue(':pts_local', $partido->marcador_local, PDO::PARAM_INT);
            $stmt->bindValue(':pts_vis', $partido->marcador_visitante, PDO::PARAM_INT);
            $stmt->bindValue(':cond_local', 'Local');
            $stmt->bindValue(':cond_vis', 'Visitante');

            $stmt->execute();
            $stmt->closeCursor();

            $res = $this->db->query("SELECT @id_generado AS id_generado, @resultado AS resultado, @mensaje AS mensaje")->fetch();
            
            if (!$res || !$res['resultado']) {
                if ($startedTransaction) {
                    $this->db->rollBack();
                }
                return false;
            }

            // Actualizar el ID en el objeto si fue generado
            if ($partido->id_partido === null && isset($res['id_generado'])) {
                $partido->id_partido = (int)$res['id_generado'];
            }

            if ($startedTransaction) {
                $this->db->commit();
            }
            return true;
        } catch (Exception $e) {
            if ($startedTransaction) {
                $this->db->rollBack();
            }
            throw $e;
        }
    }

    /**
     * Actualiza el marcador e ingresa los resultados en la relación 3NF.
     */
    public function actualizarMarcador(int $id_partido, int $marcador_local, int $marcador_visitante, string $estado = 'Finalizado'): bool {
        $startedTransaction = false;
        if (!$this->db->inTransaction()) {
            $this->db->beginTransaction();
            $startedTransaction = true;
        }

        try {
            $stmt = $this->db->prepare("CALL sp_ActualizarResultadoPartido(:id_partido, :estado, :pts_local, :pts_vis, @resultado, @mensaje)");
            $stmt->execute([
                'id_partido' => $id_partido,
                'estado' => $estado,
                'pts_local' => $marcador_local,
                'pts_vis' => $marcador_visitante
            ]);
            $stmt->closeCursor();

            $res = $this->db->query("SELECT @resultado AS resultado, @mensaje AS mensaje")->fetch();
            $success = (bool)($res['resultado'] ?? false);

            if ($startedTransaction) {
                if ($success) {
                    $this->db->commit();
                } else {
                    $this->db->rollBack();
                }
            }
            return $success;
        } catch (Exception $e) {
            if ($startedTransaction) {
                $this->db->rollBack();
            }
            throw $e;
        }
    }
}
